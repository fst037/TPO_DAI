package com.uade.tpo.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class MailService {

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendHtmlMail(String toEmail, String subject, String htmlBody) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

        helper.setFrom("chefdebolsilloapp@gmail.com");
        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(htmlBody, true); // `true` habilita HTML en el cuerpo del mensaje

        javaMailSender.send(mimeMessage);
        System.out.println("Correo enviado exitosamente con HTML.");
    }

    public void sendVerificationCode(String toEmail, String verificationCode) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
      
        helper.setFrom("chefdebolsilloapp@gmail.com");
        helper.setTo("santiagocarle37@gmail.com");
        helper.setSubject("Verificación de cuenta - Chef de Bolsillo");
        String htmlBody = "<html>" +
                "<body>" +
                "<h1>¡Bienvenido a Chef de Bolsillo!</h1>" +
                "<p>Para completar tu registro, por favor ingresa el siguiente código de verificación:</p>" +
                "<h2 style='color: #4CAF50;'>" + verificationCode + "</h2>" +
                "<p>Este código es válido por 24 horas.</p>" +
                "<p>Si no solicitaste este registro, ignora este correo.</p>" +
                "</body>" +
                "</html>";
        helper.setText(htmlBody, true); // `true` habilita HTML en el cuerpo del mensaje
        javaMailSender.send(mimeMessage);
        System.out.println("Correo de verificación enviado exitosamente.");
    }

    public void sendPasswordResetCode(String toEmail, String resetVerificationCode) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
      
        helper.setFrom("chefdebolsilloapp@gmail.com");
        helper.setTo(toEmail);
        helper.setSubject("Restablecimiento de contraseña - Chef de Bolsillo");
        String htmlBody = "<html>" +
                "<body>" +
                "<h1>Restablecimiento de contraseña</h1>" +
                "<p>Para restablecer tu contraseña, por favor ingresa el siguiente código en la aplicación:</p>" +
                "<h2 style='color: #4CAF50;'>" + resetVerificationCode + "</h2>" +
                "<p>Este código es válido por 30 minutos.</p>" +
                "<p>Si no solicitaste este restablecimiento, ignora este correo.</p>" +
                "</body>" +
                "</html>";
        helper.setText(htmlBody, true); // `true` habilita HTML en el cuerpo del mensaje
        javaMailSender.send(mimeMessage);
        System.out.println("Correo de restablecimiento de contraseña enviado exitosamente.");
    }
}
