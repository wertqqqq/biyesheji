package com.zhiwei.food.controller;

import com.zhiwei.food.common.ApiResult;
import com.zhiwei.food.common.BizException;
import com.zhiwei.food.dto.AddressReq;
import com.zhiwei.food.model.Address;
import com.zhiwei.food.repository.AddressRepository;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/** 收货地址增删改查。 */
@RestController
public class AddressController {

    private final AddressRepository repo;

    public AddressController(AddressRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/users/{userId}/addresses")
    public ApiResult<List<Address>> list(@PathVariable String userId) {
        return ApiResult.ok(repo.findByUserIdOrderByIdAsc(userId));
    }

    @PostMapping("/users/{userId}/addresses")
    public ApiResult<Address> create(@PathVariable String userId, @RequestBody AddressReq req) {
        if (req == null || req.getName() == null || req.getName().isBlank()) {
            throw new BizException("请填写联系人");
        }
        if (req.getPhone() == null || !req.getPhone().matches("1\\d{10}")) {
            throw new BizException("手机号格式不正确");
        }
        if (req.getAddress() == null || req.getAddress().isBlank()) {
            throw new BizException("请填写地址");
        }

        Address a = new Address();
        a.setId("a" + System.currentTimeMillis());
        a.setUserId(userId);
        a.setName(req.getName());
        a.setPhone(req.getPhone());
        a.setTag(req.getTag() == null ? "" : req.getTag());
        a.setAddress(req.getAddress());
        a.setDetail(req.getDetail() == null ? "" : req.getDetail());
        a.setGeohash(req.getGeohash());
        a.setSex(req.getSex() == null ? 1 : req.getSex());
        repo.save(a);
        return ApiResult.ok(a);
    }

    /** 局部更新：仅覆盖请求中非 null 的字段。 */
    @PutMapping("/users/{userId}/addresses/{addressId}")
    public ApiResult<Address> update(@PathVariable String userId,
                                     @PathVariable String addressId,
                                     @RequestBody AddressReq req) {
        Address a = repo.findById(addressId).orElseThrow(() -> new BizException(404, "地址不存在"));
        if (req != null) {
            if (req.getName() != null) {
                a.setName(req.getName());
            }
            if (req.getPhone() != null) {
                a.setPhone(req.getPhone());
            }
            if (req.getTag() != null) {
                a.setTag(req.getTag());
            }
            if (req.getAddress() != null) {
                a.setAddress(req.getAddress());
            }
            if (req.getDetail() != null) {
                a.setDetail(req.getDetail());
            }
            if (req.getGeohash() != null) {
                a.setGeohash(req.getGeohash());
            }
            if (req.getSex() != null) {
                a.setSex(req.getSex());
            }
            repo.save(a);
        }
        return ApiResult.ok(a);
    }

    @DeleteMapping("/users/{userId}/addresses/{addressId}")
    public ApiResult<Map<String, Object>> delete(@PathVariable String userId, @PathVariable String addressId) {
        if (!repo.existsById(addressId)) {
            throw new BizException(404, "地址不存在");
        }
        repo.deleteById(addressId);
        return ApiResult.ok(Map.of("ok", true));
    }
}
