package SAE501.JLTT.TrainU;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class TrainUApplication {

	public static void main(String[] args) {
		SpringApplication.run(TrainUApplication.class, args);
	}

}
