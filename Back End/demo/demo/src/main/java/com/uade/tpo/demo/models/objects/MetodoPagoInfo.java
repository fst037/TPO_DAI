package com.uade.tpo.demo.models.objects;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MetodoPagoInfo {
    private String paymentMethodId;
    private String issuerId;
}
