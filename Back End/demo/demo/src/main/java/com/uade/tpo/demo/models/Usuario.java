package com.uade.tpo.demo.models;

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
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario implements UserDetails {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer idUsuario;

  @Column(unique = true, length = 150)
  private String mail;

  @Column(nullable = false, length = 100)
  private String nickname;

  @Column(length = 2)
  private String habilitado;

  private String nombre;
  private String direccion;
  private String avatar;
  private String password;
  private List<Role> roles;

  @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  @JoinColumn(name = "alumno_id", referencedColumnName = "idAlumno")
  private Alumno alumno;

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return roles.stream()
      .map(role -> new SimpleGrantedAuthority(role.name()))
      .toList();
  }

  @Override
  public String getUsername() {
    return nickname;
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
    return habilitado.toLowerCase() == "si";
  }
}
