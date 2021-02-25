# Development kommu

You need to download Docker & Docker Compose
For this you can run this command from your command line (Ubuntu)

Install Docker
```
$ sudo apt install docker
```
Install Docker Compose
```
$ sudo curl -L "https://github.com/docker/compose/releases/download/1.23.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```
```
$ sudo chmod +x /usr/local/bin/docker-compose
```
```
$ docker-compose --version
```
```
$ docker-compose version 1.23.1, build b02f1306
```

Then:

you just need to run APP with:
- this command is to start & attach logs
```
$ docker-compose up --build
```

- this command is to start & detach logs
```
$ docker-compose up --build -d
```

- this command is to suspend container
```
$ docker-compose stop
```

- this command is to resume container
```
$ docker-compose start
```

- this command is to destroy container
```
$ docker-compose down -v
```

- this command is to see logs
```
$ docker-compose logs -f kommu 
```

# ports:
* ##### Postgres Server: 5432
* ##### Kommu API: 8000
* ##### Node Debug Port: 9228

