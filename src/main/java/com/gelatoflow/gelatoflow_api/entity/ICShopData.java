package com.gelatoflow.gelatoflow_api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "GF_IC_SHOPS")
@NoArgsConstructor
@AttributeOverrides({
        @AttributeOverride(name = "creationDate", column = @Column(name = "ICS_CRE_DATE", nullable = false, updatable = false)),
        @AttributeOverride(name = "modificationDate", column = @Column(name = "ICS_MOD_DATE")),
        @AttributeOverride(name = "deletionDate", column = @Column(name = "ICS_DEL_DATE"))
})
public class ICShopData extends AuditFieldsData{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PK_ICS_ID_SEQ")
    @SequenceGenerator(name = "PK_ICS_ID_SEQ", sequenceName = "PK_ICS_ID_SEQ", initialValue = 50)
    @Column(name = "ICS_ID")
    private Long id;

    @Column(name = "ICS_NAME", nullable = false, length = 100)
    private String name;

    @Column(name = "ICS_LOCATION", nullable = false, length = 100)
    private String location;

    @ManyToOne
    @JoinColumn(name = "ICS_OWNER_ID", referencedColumnName = "USR_ID", nullable = false, insertable = false, updatable = false)
    private UserData owner;

    @Column(name="ICS_OWNER_ID",nullable = false)
    private Long ownerId;

    @ManyToMany
    @JoinTable(
            name = "GF_USER_SHOP_HISTORY",
            joinColumns = @JoinColumn(name = "USH_ICS_ID"),
            inverseJoinColumns = @JoinColumn(name = "USH_USR_ID")
    )
    private Set<UserData> users = new HashSet<>();
}
