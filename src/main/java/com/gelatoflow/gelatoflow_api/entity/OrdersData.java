package com.gelatoflow.gelatoflow_api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "GF_ORDERS")
@NoArgsConstructor

public class OrdersData {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PK_ORD_ID_SEQ")
    @SequenceGenerator(name = "PK_ORD_ID_SEQ", sequenceName = "PK_ORD_ID_SEQ", initialValue = 50)
    @Column(name = "ORD_ID")
    private Long id;

    @Column(name="ORD_TITLE", length =100, nullable = false)
    private String title;

    @Column(name="ORD_QUANTITY")
    private Integer quantity;

    @Column(name="ORD_CREATION_DATE", nullable = false, updatable = false)
    private LocalDateTime creationDate;

    @Column(name="ORD_MODIFICATION_DATE")
    private LocalDateTime modificationDate;

    //JAKO ID OST_ID
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ORD_STATUS", referencedColumnName = "OST_ID", nullable = false, updatable = false, insertable = false)
    private OrderStatusData status;

    @Column(name = "ORD_STATUS", nullable = false)
    private Long statusId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ORD_PRIORITY", referencedColumnName = "OPR_ID", nullable = false, updatable = false, insertable = false)
    private OrderPriorityData priority;

    @Column(name = "ORD_PRIORITY", nullable = false)
    private Long priorityId;

}
