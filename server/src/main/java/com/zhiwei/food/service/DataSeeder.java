package com.zhiwei.food.service;

import com.zhiwei.food.common.Constants;
import com.zhiwei.food.common.PasswordUtil;
import com.zhiwei.food.model.Address;
import com.zhiwei.food.model.Order;
import com.zhiwei.food.model.OrderItem;
import com.zhiwei.food.model.User;
import com.zhiwei.food.repository.AddressRepository;
import com.zhiwei.food.repository.OrderRepository;
import com.zhiwei.food.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

/**
 * 启动时写入演示数据（仅当表为空时，避免覆盖运行期产生的数据）。
 * H2 为文件库，新增地址 / 下单结果会持久化到 server/data。
 */
@Component
public class DataSeeder implements ApplicationRunner {

    private final UserRepository userRepo;
    private final AddressRepository addressRepo;
    private final OrderRepository orderRepo;

    public DataSeeder(UserRepository userRepo, AddressRepository addressRepo, OrderRepository orderRepo) {
        this.userRepo = userRepo;
        this.addressRepo = addressRepo;
        this.orderRepo = orderRepo;
    }

    @Override
    public void run(ApplicationArguments args) {
        seedUser();
        seedAddresses();
        seedOrders();
    }

    private void seedUser() {
        if (userRepo.count() > 0) {
            return;
        }
        User u = new User();
        u.setId(Constants.DEMO_USER_ID);
        u.setUsername("demo");
        u.setPhone("13800000000");
        u.setPasswordHash(PasswordUtil.hash("demo", Constants.DEMO_PASSWORD));
        u.setAvatar("wode");
        u.setBalance(12800);
        u.setPoints(2360);
        u.setGiftAmount(3);
        userRepo.save(u);
    }

    private void seedAddresses() {
        if (addressRepo.count() > 0) {
            return;
        }
        String uid = Constants.DEMO_USER_ID;

        Address a1 = new Address();
        a1.setId("a1");
        a1.setUserId(uid);
        a1.setName("张先生");
        a1.setPhone("138****8888");
        a1.setTag("家");
        a1.setAddress("徐家汇 · 汇金百货");
        a1.setDetail("肇嘉浜路 1000 号 12 楼 1201");
        a1.setGeohash("31.22299,121.36025");
        a1.setSex(1);

        Address a2 = new Address();
        a2.setId("a2");
        a2.setUserId(uid);
        a2.setName("李女士");
        a2.setPhone("139****6666");
        a2.setTag("公司");
        a2.setAddress("人民广场 · 来福士");
        a2.setDetail("西藏中路 268 号 8 楼");
        a2.setGeohash("31.23221,121.46921");
        a2.setSex(0);

        addressRepo.save(a1);
        addressRepo.save(a2);
    }

    private void seedOrders() {
        if (orderRepo.count() > 0) {
            return;
        }
        String uid = Constants.DEMO_USER_ID;
        long now = System.currentTimeMillis();

        Order o1 = new Order();
        o1.setId("o9001");
        o1.setUserId(uid);
        o1.setShopName("川香居 · 麻辣香锅");
        o1.setShopImage("🌶️");
        o1.setShopLogoColor("#ff5a3c");
        o1.setStatus("已完成");
        o1.setStatusCode("DONE");
        o1.setTotal(56);
        o1.setTimeAgo("3 天前");
        o1.setAddress("徐家汇 · 汇金百货 12 楼");
        o1.setRemark("");
        o1.setFoods(new ArrayList<>(java.util.List.of(
                new OrderItem("招牌麻辣香锅", 1, 38),
                new OrderItem("精品肥牛", 1, 22))));
        o1.setCreatedAt(now - 3L * 24 * 3600 * 1000);

        Order o2 = new Order();
        o2.setId("o9002");
        o2.setUserId(uid);
        o2.setShopName("茶语时光");
        o2.setShopImage("🧋");
        o2.setShopLogoColor("#c084fc");
        o2.setStatus("配送中");
        o2.setStatusCode("DELIVERING");
        o2.setTotal(39);
        o2.setTimeAgo("今天 12:30");
        o2.setAddress("人民广场 · 来福士 8 楼");
        o2.setRemark("");
        o2.setFoods(new ArrayList<>(java.util.List.of(
                new OrderItem("黑糖珍珠鲜奶", 2, 18),
                new OrderItem("杨枝甘露", 1, 20))));
        o2.setCreatedAt(now - 2L * 3600 * 1000);

        orderRepo.save(o1);
        orderRepo.save(o2);
    }
}
