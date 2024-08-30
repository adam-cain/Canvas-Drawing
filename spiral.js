var X, Y, dx, dy, x, y;
X = 1001;
Y = 1001;
x = y = 0;
dx = 0;
dy = -1;

for (var i = 0; i <= Math.pow(Math.max(X, Y), 2); i ++) {
  if (-X / 2 < x && x <= X / 2 && -Y / 2 < y && y <= Y / 2) {
    if (x === y || x < 0 && x === -y || x > 0 && x === 1 - y) {
      [dx, dy] = [-dy, dx];
    }
    [x, y] = [x + dx, y + dy];
  }
}
