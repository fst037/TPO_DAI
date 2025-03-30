package com.uade.tpo.demo.models.responses;

import com.uade.tpo.demo.models.objects.MultimediaContent;

import lombok.Data;

@Data
public class MultimediaContentDTO {
  private Integer id;
  private Integer stepId;
  private String contentType;
  private String extension;
  private String contentUrl;

  public MultimediaContentDTO(MultimediaContent multimediaContent) {
    this.id = multimediaContent.getIdContent();
    this.stepId = multimediaContent.getStep().getIdStep();
    this.contentType = multimediaContent.getContentType();
    this.extension = multimediaContent.getExtension();
    this.contentUrl = multimediaContent.getContentUrl();
  }
}
