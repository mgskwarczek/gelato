package com.gelatoflow.gelatoflow_api.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name="GF_USERS")
@AttributeOverrides({
        @AttributeOverride(name = "creationDate", column = @Column(name = "USR_CRE_DATE", nullable = false, updatable = false)),
        @AttributeOverride(name = "modificationDate", column = @Column(name = "USR_MOD_DATE")),
        @AttributeOverride(name = "deletionDate", column = @Column(name = "USR_DEL_DATE"))
})
public class UserData extends AuditFieldsData {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PK_USR_ID_SEQ")
    @SequenceGenerator(name = "PK_USR_ID_SEQ", sequenceName = "PK_USR_ID_SEQ", initialValue = 50)

    @Column(name = "USR_ID")
    private Long id;

    @Column(name = "USR_FIRST_NAME", length = 100)
    private String firstName;

    @Column(name = "USR_LAST_NAME", length = 100)
    private String lastName;

    @Column(name = "USR_EMAIL", nullable = false)
    private String email;

    @Column(name = "USR_PASSWORD", nullable = false)
    private String password;

    @ManyToOne
    @JoinColumn(name = "USR_ROL_ID", referencedColumnName = "ROL_ID", updatable = false, insertable = false)
    private RoleData role;

    @Column(name = "USR_ROL_ID", nullable = false)
    private Long roleId;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "GF_USERS_SHOPS", joinColumns = {@JoinColumn(name = "USH_USR_ID")},
            inverseJoinColumns = {@JoinColumn(name = "USH_ICS_ID")})
    @MapKey(name = "id")
    private Map<Long, ICShopData> shops = new HashMap<>();


    @OneToMany(mappedBy ="owner", cascade=CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ICShopData> ownedShops;
}
