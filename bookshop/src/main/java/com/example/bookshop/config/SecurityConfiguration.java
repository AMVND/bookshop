package com.example.bookshop.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
//@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final LogoutHandler logoutHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Enable CORS
        http.cors();
        http
                .csrf()
                .disable()
                .authorizeHttpRequests()
//                các trang được truy cập sử dụng không cần đăng nhập
                .requestMatchers(
                        "/api/**",
                        "/product/api/**",
                        "/category/api/**",
                        "/product-category/api/**",
                        "/user/api/**",
                        "/comment/api/**",
                        "/product-review/api/**"
                )
                .permitAll()
                //test phân quyền truy cập
//                .requestMatchers("/user/auth/forUser/**").hasAnyAuthority("USER", "ADMIN")
                .requestMatchers("/user/auth/admin/**").hasAnyAuthority("ADMIN")
                .requestMatchers("/product-category/auth/admin/**").hasAnyAuthority("ADMIN")
                .requestMatchers("/product/auth/admin/**").hasAnyAuthority("ADMIN")
                .requestMatchers("/order/auth/admin/**").hasAnyAuthority("ADMIN")
                .requestMatchers("/transaction/auth/admin/**").hasAnyAuthority("ADMIN")
                .requestMatchers("/category/auth/**").hasAnyAuthority("ADMIN")

                .anyRequest()
                .authenticated()
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .logout()
                .logoutUrl("/api/v1/auth/logout")
                .addLogoutHandler(logoutHandler)
                .logoutSuccessHandler((request, response, authentication) -> SecurityContextHolder.clearContext())
        ;

        return http.build();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:3000"); // Replace with the appropriate allowed origin(s)
        configuration.addAllowedMethod("GET");
        configuration.addAllowedMethod("POST");
        configuration.addAllowedMethod("PUT");
        configuration.addAllowedMethod("DELETE");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
