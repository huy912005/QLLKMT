package com.Huy.WebBanHang.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "Tinh")
@Getter
@Setter
public class TinhEntity {
    @Id
    @Column(name = "idTinh", columnDefinition = "char(4)")
    private String idTinh;
    @Column(name = "tenTinh", nullable = false)
    private String tenTinh;
    // mappedBy = "tinh" : private Tinh tinh
    @OneToMany(mappedBy = "tinh", fetch = FetchType.LAZY)
    private List<XaPhuongEntity> xaPhuongs;
}
