package com.Huy.WebBanHang.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "AspNetRoles")
@Getter
@Setter
@NoArgsConstructor
public class ApplicationRoleEntity {
    @Id
    @Column(name = "Id")
    private String id;

    @Column(name = "Name", length = 256)
    private String name;

    @Column(name = "NormalizedName", length = 256)
    private String normalizedName;

    @Column(name = "ConcurrencyStamp")
    private String concurrencyStamp;
}
