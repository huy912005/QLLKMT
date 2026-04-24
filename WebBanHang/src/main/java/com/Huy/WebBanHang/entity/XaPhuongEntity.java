package com.Huy.WebBanHang.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "XaPhuong")
@Getter
@Setter
public class XaPhuongEntity {
    @Id
    @Column(name = "idXaPhuong", columnDefinition = "char(5)")
    private String idXaPhuong;
    @Column(name = "tenXaPhuong", nullable = false)
    private String tenXaPhuong;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idTinh", nullable = false)
    private TinhEntity tinh;
}
