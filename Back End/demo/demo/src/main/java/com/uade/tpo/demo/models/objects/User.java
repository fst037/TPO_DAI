package com.uade.tpo.demo.models.objects;

import jakarta.persistence.*;
import lombok.*;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Builder
@Table(name = "usuarios") // Keep the table name in Spanish
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "idUsuario")
  private Integer idUser;

  @Column(name = "mail", unique = true, length = 150) 
  private String email;

  @Column(name = "nickname", nullable = false, length = 100) 
  private String nickname;

  @Column(name = "contraseña")
  private String password;

  @Column(name = "nombre")
  private String name;

  @Column(name = "direccion")
  private String address;

  @Column(name = "avatar")
  private String avatar;

  @Column(name = "habilitado", length = 2)
  private String enabled;

  @Column(name = "tarjeta_validada")
  @Builder.Default
  private Boolean tarjetaValidada = false;

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<Recipe> recipes;

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<Rating> ratings;

  @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  @JoinColumn(name = "idAlumno", referencedColumnName = "idAlumno")
  private Student student;

  @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private UserExtended userExtended;

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return this.getUserExtended().getRoles().stream()
      .map(role -> new SimpleGrantedAuthority(role.name()))
      .toList();
  }

  @Override
  public String getUsername() {
    return email;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return enabled.toLowerCase().equals("si");
  }
}