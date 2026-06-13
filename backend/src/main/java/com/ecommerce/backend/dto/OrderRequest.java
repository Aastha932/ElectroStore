package com.ecommerce.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class OrderRequest {
    @NotBlank
    private String shippingAddress;

    @NotBlank
    private String contactNumber;

    public OrderRequest() {}

    public OrderRequest(String shippingAddress, String contactNumber) {
        this.shippingAddress = shippingAddress;
        this.contactNumber = contactNumber;
    }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
}
