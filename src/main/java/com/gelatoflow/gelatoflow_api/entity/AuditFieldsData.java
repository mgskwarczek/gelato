package com.gelatoflow.gelatoflow_api.entity;


import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@MappedSuperclass
public class AuditFieldsData {
    @Column(name=" ")
    private LocalDateTime modificationDate;

    @Column(name=" ")
    private LocalDateTime creationDate;

    @Column(name=" ")
    private LocalDateTime deletionDate;

//    @Transactional
//    public abstract List<LogValueDto> compare(T entity);
}
