package com.zhiwei.food.controller;

import com.zhiwei.food.common.ApiResult;
import com.zhiwei.food.common.BizException;
import com.zhiwei.food.common.Constants;
import com.zhiwei.food.data.ReferenceData;
import com.zhiwei.food.data.ShopCatalog;
import com.zhiwei.food.dto.CheckoutReq;
import com.zhiwei.food.model.Address;
import com.zhiwei.food.model.Shop;
import com.zhiwei.food.repository.AddressRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** 购物车结算 / 备注 / 可用地址 / 支付验证。 */
@RestController
public class CartController {

    private final ShopCatalog catalog;
    private final AddressRepository addressRepo;
    private final ReferenceData ref;

    public CartController(ShopCatalog catalog, AddressRepository addressRepo, ReferenceData ref) {
        this.catalog = catalog;
        this.addressRepo = addressRepo;
        this.ref = ref;
    }

    @PostMapping("/carts/checkout")
    public ApiResult<Map<String, Object>> checkout(@RequestBody CheckoutReq req) {
        if (req == null || req.getEntities() == null || req.getEntities().isEmpty()) {
            throw new BizException("购物车是空的");
        }
        if (req.getRestaurantId() == null || req.getRestaurantId().isBlank()) {
            throw new BizException(404, "商家不存在");
        }
        Shop shop = catalog.find(req.getRestaurantId())
                .orElseThrow(() -> new BizException(404, "商家不存在"));

        double goods = req.getEntities().stream()
                .mapToDouble(e -> e.getPrice() * e.getQuantity())
                .sum();
        double packingFee = round2(req.getEntities().size() * 1.5);
        double total = round2(goods + packingFee + shop.getDeliveryFee());

        if (goods < shop.getMinOrderAmount()) {
            throw new BizException(String.format("还差 ¥%.2f 起送", shop.getMinOrderAmount() - goods));
        }

        Map<String, Object> m = new LinkedHashMap<>();
        m.put("cartId", "cart-" + System.currentTimeMillis());
        m.put("sig", "mock-sig");
        m.put("total", total);
        m.put("goodsTotal", round2(goods));
        m.put("packingFee", packingFee);
        m.put("deliveryFee", shop.getDeliveryFee());
        m.put("minOrderAmount", shop.getMinOrderAmount());
        return ApiResult.ok(m);
    }

    @GetMapping("/carts/{id}/remarks")
    public ApiResult<Object> remarks(@PathVariable String id) {
        return ApiResult.ok(ref.content("quickRemarks"));
    }

    @GetMapping("/carts/{id}/addresses")
    public ApiResult<List<Address>> addresses(@PathVariable String id) {
        return ApiResult.ok(addressRepo.findByUserIdOrderByIdAsc(Constants.DEMO_USER_ID));
    }

    @PostMapping("/carts/{id}/verify")
    public ApiResult<Map<String, Object>> verify(@PathVariable String id) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("sent", true);
        m.put("mockCode", Constants.MOCK_SMS_CODE);
        return ApiResult.ok(m);
    }

    private static double round2(double v) {
        return Math.round(v * 100) / 100.0;
    }
}
