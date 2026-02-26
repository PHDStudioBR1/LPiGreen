-- Criar usuário da aplicação (executar após init.sql)
-- Use variáveis de ambiente no job: MYSQL_ROOT_PASSWORD, MYSQL_APP_USER, MYSQL_APP_PASSWORD
-- Exemplo em shell: mysql -h mysql -u root -p"$MYSQL_ROOT_PASSWORD" < create-app-user.sql
-- Ou injetar no SQL: sed "s/__APP_USER__/$MYSQL_APP_USER/g; s/__APP_PASSWORD__/$MYSQL_APP_PASSWORD/" create-app-user.sql | mysql ...

CREATE USER IF NOT EXISTS 'igreen_app'@'%' IDENTIFIED BY 'change_me_in_secret';
GRANT SELECT, INSERT, UPDATE ON igreen_captacao.* TO 'igreen_app'@'%';
FLUSH PRIVILEGES;
