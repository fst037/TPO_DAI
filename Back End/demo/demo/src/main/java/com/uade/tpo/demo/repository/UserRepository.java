package com.uade.tpo.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.demo.models.Usuario;

@Repository
public interface UserRepository extends JpaRepository<Usuario, Long> {

  Optional<Usuario> findByMail(String mail);

  Optional<Usuario> findByNickname(String nickname);

  Optional<Usuario> findByMailOrNickname(String mail, String nickname);
}
