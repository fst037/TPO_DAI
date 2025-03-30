package com.uade.tpo.demo.models.objects;

import jakarta.persistence.*;
import lombok.*;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.uade.tpo.demo.models.enums.Role;

@Entity
@Builder
@Table(name = "usuarios") // Keep the table name in Spanish
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "idUsuario") // Map to the Spanish column name
  private Integer idUser;

  @Column(name = "mail", unique = true, length = 150)  // Map to the Spanish column name
  private String email;

  @Column(name = "nickname", nullable = false, length = 100)  // Map to the Spanish column name
  private String nickname;

  @Column(name = "contraseña") // Map to the Spanish column name
  private String password;

  @Column(name = "nombre") // Map to the Spanish column name
  private String name;

  @Column(name = "direccion") // Map to the Spanish column name
  private String address;

  @Column(name = "avatar") // Map to the Spanish column name
  private String avatar;

  @Column(name = "habilitado", length = 2)
  private String enabled;
  
  private List<Role> roles;

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<Recipe> recipes;

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<Rating> ratings;

  @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  @JoinColumn(name = "idAlumno", referencedColumnName = "idAlumno") // Keep the column name in Spanish
  private Student student;

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return roles.stream()
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