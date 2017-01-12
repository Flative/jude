# How to run server

#### 1. Install Go 1.7

Follow below link

https://golang.org/doc/install#install

#### 2. Set up your go environment

Add below scripts to your `.bashrc` or `your own rc`

```bash
export PATH=$PATH:/usr/local/go/bin
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin
```

#### 3. Get jude

```bash
go get github.com/Flative/jude/backend
```

#### 4. Start server:

```bash
cd $GOPATH/src/github.com/flative/jude/backend
go build -o runner && ./runner
# OR
go build -o runner && ./runner -port 1234
```

