package com.zhiwei.food.controller;

import com.zhiwei.food.common.ApiResult;
import com.zhiwei.food.common.BizException;
import com.zhiwei.food.common.Constants;
import com.zhiwei.food.data.ShopCatalog;
import com.zhiwei.food.dto.PlaceOrderReq;
import com.zhiwei.food.model.Address;
import com.zhiwei.food.model.Order;
import com.zhiwei.food.model.OrderItem;
import com.zhiwei.food.model.Shop;
import com.zhiwei.food.repository.AddressRepository;
import com.zhiwei.food.repository.OrderRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/** 订单：列表 / 详情 / 下单。 */
@RestController
public class OrderController {

    private final OrderRepository orderRepo;
    private final AddressRepository addressRepo;
    private final ShopCatalog catalog;

    public OrderController(OrderRepository orderRepo, AddressRepository addressRepo, ShopCatalog catalog) {
        this.orderRepo = orderRepo;
        this.addressRepo = addressRepo;
        this.catalog = catalog;
    }

    @GetMapping("/users/{userId}/orders")
    public ApiResult<Map<String, Object>> list(@PathVariable String userId,
                                               @RequestParam(required = false) String offset,
                                               @RequestParam(required = false) String limit) {
        List<Order> all = orderRepo.findByUserIdOrderByCreatedAtDesc(userId);
        int off = parseInt(offset, 0);
        int lim = parseInt(limit, 10);
        int from = Math.min(off, all.size());
        int to = Math.min(off + lim, all.size());

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("list", all.subList(from, to));
        res.put("hasMore", off + lim < all.size());
        res.put("offset", off);
        return ApiResult.ok(res);
    }

    @GetMapping("/users/{userId}/orders/{orderId}/snapshot")
    public ApiResult<Order> snapshot(@PathVariable String userId, @PathVariable String orderId) {
        return ApiResult.ok(orderRepo.findById(orderId)
                .orElseThrow(() -> new BizException(404, "订单不存在")));
    }

    @PostMapping("/users/{userId}/orders")
    public ApiResult<Order> place(@PathVariable String userId, @RequestBody PlaceOrderReq req) {
        if (req == null || req.getEntities() == null || req.getEntities().isEmpty()) {
            throw new BizException("购物车是空的");
        }
        if (req.getValidationCode() != null && !req.getValidationCode().isBlank()
                && !Constants.MOCK_SMS_CODE.equals(req.getValidationCode())) {
            throw new BizException("验证码错误");
        }
        if (req.getAddressId() == null || req.getAddressId().isBlank()) {
            throw new BizException("请选择收货地址");
        }

        List<Address> addresses = addressRepo.findByUserIdOrderByIdAsc(userId);
        Address addr = addresses.stream()
                .filter(a -> a.getId().equals(req.getAddressId()))
                .findFirst()
                .orElseGet(() -> addresses.isEmpty() ? null : addresses.get(0));
        if (addr == null) {
            throw new BizException(404, "地址不存在");
        }

        Shop shop = null;
        if (req.getRestaurantId() != null && !req.getRestaurantId().isBlank()) {
            shop = catalog.find(req.getRestaurantId()).orElse(null);
        }
        if (shop == null && !catalog.all().isEmpty()) {
            shop = catalog.all().get(0);
        }
        if (shop == null) {
            throw new BizException(404, "商家不存在");
        }

        double goods = req.getEntities().stream()
                .mapToDouble(e -> e.getPrice() * e.getQuantity())
                .sum();
        double packingFee = req.getEntities().size() * 1.5;
        double total = round2(goods + packingFee + shop.getDeliveryFee());

        Order o = new Order();
        o.setId("o" + System.currentTimeMillis());
        o.setUserId(userId);
        o.setShopName(shop.getName());
        o.setShopImage(shop.getImage());
        o.setShopLogoColor(shop.getLogoColor());
        o.setStatus("已下单");
        o.setStatusCode("PLACED");
        o.setTotal(total);
        o.setTimeAgo("刚刚");
        o.setAddress(safe(addr.getAddress()) + " " + safe(addr.getDetail()));
        o.setRemark(req.getDescription() == null ? "" : req.getDescription());
        o.setFoods(req.getEntities().stream()
                .map(e -> new OrderItem(e.getName(), e.getQuantity(), e.getPrice()))
                .collect(Collectors.toList()));
        o.setCreatedAt(System.currentTimeMillis());

        orderRepo.save(o);
        return ApiResult.ok(o);
    }

    private static String safe(String s) {
        return s == null ? "" : s;
    }

    private static double round2(double v) {
        return Math.round(v * 100) / 100.0;
    }

    private static int parseInt(String s, int def) {
        if (s == null || s.isBlank()) {
            return def;
        }
        try {
            return Integer.parseInt(s.trim());
        } catch (NumberFormatException e) {
            return def;
        }
    }
}
