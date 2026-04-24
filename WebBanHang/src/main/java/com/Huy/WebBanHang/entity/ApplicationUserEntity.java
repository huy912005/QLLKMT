package com.Huy.WebBanHang.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "AspNetUsers") // map đúng với tên bảng mặc định của C# Identity
@Getter
@Setter
@NoArgsConstructor
public class ApplicationUserEntity {
    @Id
    @Column(name = "Id")
    private String id;
    @Column(name = "UserName", length = 256)
    private String userName;
    @Column(name = "NormalizedUserName", length = 256)
    private String normalizedUserName;
    @Column(name = "Email", length = 256)
    private String email;
    @Column(name = "NormalizedEmail", length = 256)
    private String normalizedEmail;
    @Column(name = "PhoneNumber")
    private String phoneNumber;
    @Column(name = "PasswordHash")
    private String passwordHash;
    @Column(name = "hoTen", columnDefinition = "nvarchar(255)")
    private String hoTen;
    @Column(name = "soNha", columnDefinition = "nvarchar(255)")
    private String soNha;
    // ⚠️ Đổi tên từ isOtpVerified → otpVerified để tránh Lombok sinh isIsOtpVerified()
    @Column(name = "IsOtpVerified")
    private boolean otpVerified = false;

    // Các cột bắt buộc từ ASP.NET Identity
    @Column(name = "EmailConfirmed")
    private boolean emailConfirmed = true;

    @Column(name = "PhoneNumberConfirmed")
    private boolean phoneNumberConfirmed = false;

    @Column(name = "TwoFactorEnabled")
    private boolean twoFactorEnabled = false;

    @Column(name = "LockoutEnabled")
    private boolean lockoutEnabled = true;

    @Column(name = "AccessFailedCount")
    private int accessFailedCount = 0;

    @Column(name = "SecurityStamp")
    private String securityStamp = java.util.UUID.randomUUID().toString();

    @Column(name = "ConcurrencyStamp")
    private String concurrencyStamp = java.util.UUID.randomUUID().toString();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idPhuongXa")
    private XaPhuongEntity xaPhuong;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "AspNetUserRoles",
        joinColumns = @JoinColumn(name = "UserId"),
        inverseJoinColumns = @JoinColumn(name = "RoleId")
    )
    private java.util.Set<ApplicationRoleEntity> roles = new java.util.HashSet<>();

    @OneToMany(mappedBy = "nguoiDung", fetch = FetchType.LAZY)
    private List<DonDatHangEntity> donDatHangs;
}
