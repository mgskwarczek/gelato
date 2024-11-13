package com.gelatoflow.gelatoflow_api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "GF_PRODUCTS")
@NoArgsConstructor
@AllArgsConstructor
public class ProductsData {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PK_PRD_ID_SEQ")
    @SequenceGenerator(name = "PK_PRD_ID_SEQ", sequenceName = "PK_PRD_ID_SEQ", initialValue = 50)
    @Column(name = "PRD_ID")
    private Long id;

    @Column(name = "PRD_NAME")
    private String name;

    @Column(name = "PRD_DESCRIPTION")
    private String description;

    @Column(name = "PRD_CATEGORY")
    private String category;

    @Column(name = "PRD_QUANTITY")
    private Long quantity;

    @Column(name = "ORD_CRE_DATE", nullable = false, updatable = false)
    private LocalDateTime creationDate;

    //TO PO ID
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PRD_TYPE", referencedColumnName = "PPT_ID", nullable = false, updatable = false, insertable = false)
    private ProductTypeData type;

    @Column(name = "PRD_TYPE", nullable = false)
    private Long typeId;
}
