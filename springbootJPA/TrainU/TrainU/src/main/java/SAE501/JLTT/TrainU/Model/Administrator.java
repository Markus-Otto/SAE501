package SAE501.JLTT.TrainU.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "ADMINISTRATOR")
public class Administrator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "LOGIN", nullable = false)
    private String login;

    @Column(name = "MOT_DE_PASSE", nullable = false)
    private String motDePasse;
}
