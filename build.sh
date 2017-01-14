CURRENT=`pwd`

cd $CURRENT/frontend
yarn
npm run build

echo "Building binaries"
for GOOS in darwin linux windows; do
  for GOARCH in 386 amd64; do
    cd $CURRENT
    export GOOS=$GOOS
    export GOARCH=$GOARCH
    if [ "$GOOS" = "windows" ]; then
        EXT=".exe"
    else
        EXT=""
    fi
    export EXT=$EXT
    mkdir -p $CURRENT/dist/tmp/$GOOS-$GOARCH/frontend/static
    go build -o $CURRENT/dist/tmp/$GOOS-$GOARCH/backend/jude$EXT backend/*.go
    cp $CURRENT/frontend/index.html $CURRENT/dist/tmp/$GOOS-$GOARCH/frontend/index.html
    cp $CURRENT/frontend/static/jude.bundle.js $CURRENT/dist/tmp/$GOOS-$GOARCH/frontend/static/jude.bundle.js
    cd $CURRENT/dist/tmp
    tar zcpfP $CURRENT/dist/$GOOS-$GOARCH.tar.gz $GOOS-$GOARCH
    rm -rf $CURRENT/dist/tmp
  done
done
