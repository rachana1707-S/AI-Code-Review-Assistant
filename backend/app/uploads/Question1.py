import time

# Solve the N-Queens problem
def solve_n_queens(n):
    board = [-1] * n

    columns = set()
    diagonal1 = set()   # row - col
    diagonal2 = set()   # row + col

    # Place queens one row at a time
    def backtrack(row):
        if row == n:
            return True

        for col in range(n):

            # Skip if queen can attack
            if col in columns or (row - col) in diagonal1 or (row + col) in diagonal2:
                continue

            # Place queen
            board[row] = col
            columns.add(col)
            diagonal1.add(row - col)
            diagonal2.add(row + col)

            # Move to next row
            if backtrack(row + 1):
                return True

            # Remove queen (backtrack)
            board[row] = -1
            columns.remove(col)
            diagonal1.remove(row - col)
            diagonal2.remove(row + col)

        return False

    if backtrack(0):
        return board
    return None


# Print board for small values of N
def print_board(board):
    n = len(board)

    for row in range(n):
        for col in range(n):
            if board[row] == col:
                print("Q", end=" ")
            else:
                print(".", end=" ")
        print()


# -------------------------------
# Test with 8 Queens
# -------------------------------

print("8 Queens")

start = time.time()
solution = solve_n_queens(8)
end = time.time()

print_board(solution)
print("Time:", round(end - start, 6), "seconds")


# -------------------------------
# Test with 100 Queens
# -------------------------------

print("\n100 Queens")

start = time.time()
solution100 = solve_n_queens(100)
end = time.time()

if solution100:
    print("Solution found!")
else:
    print("No solution found.")

print("Time:", round(end - start, 6), "seconds")