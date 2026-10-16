package com.zhiwei.food.repository;

import com.zhiwei.food.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, String> {
    List<Address> findByUserIdOrderByIdAsc(String userId);
}
