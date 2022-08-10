import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(" "))
  const [currentSide, setCurrentSide] = useState("X")
  const [winner, setWinner] = useState("")
  const [finished, setFinished] = useState(false)
  
  // to create each rows
  const rowOne = board.slice(0, 3).map((v, i) => <Field key={i} side={v} index={i} />)
  const rowTwo = board.slice(3, 6).map((v, i) => <Field key={i + 3} side={v} index={i + 3} />)
  const rowThree = board.slice(6).map((v, i) => <Field key={i + 6} side={v} index={i + 6} />)

  // to check winner when board get updated
  useEffect(() => {
    checkWinner(board)
  }, [board])
  
  function Row({children}) {
    return (
      <View style={styles.row}>{children}</View>
    )
  }

  function Field({side, index}) {
    return (
      <View style={styles.field}>
        <Text style={styles.fieldText} onPress={e => move(e, index, currentSide)}>{side}</Text>
      </View>
    )
  }

  // --------------------------- tic tac toe logics -----------------------------
  const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // update the borad when player touch the screen
  function move(e, index, currentSide) {
    const newMove = [...board];
    if (newMove[index] === " " && !finished) {
      newMove[index] = currentSide;
      setBoard(newMove);
      setCurrentSide(currentSide => currentSide === "X" ? "O" : "X")
      // console.log(e.target.viewConfig.validAttributes.style)
      // e.target.viewConfig.validAttributes.style.transform = [{rotateY: "180deg"}]
    }
  }

  // check winning condition
  function won(board) {
    let win = "";
    winCombinations.forEach((combo) => {
      if (
        board[combo[0]] !== " " &&
        board[combo[0]] === board[combo[1]] &&
        board[combo[1]] === board[combo[2]]
      ) {
        win = board[combo[0]];
      }
    });
    return win;
  }

  // check if the board is full
  function full(board) {
    return board.filter((index) => index === " ").length === 0 ? !won(board) : false;
  }

  // check if game is a draw
  function draw(board) {
    return full(board) && !won(board);
  }

  // game over when draw or having a winner
  function over(board) {
    return draw(board) || won(board);
  }

  // check who is the winner
  function checkWinner(board) {
    let winner = ""
    if (over(board)) {
      if (draw(board)) {
        winner = "Draw"
        setFinished(!finished)
      } else if (won(board)) {
        winner = won(board) + " Win!"
        setFinished(!finished)
      }
    }
    setWinner(winner)
  };

  function resetBoard() {
    const newBoard = Array(9).fill(" ")
    setBoard(newBoard)
    setCurrentSide("X")
    setFinished(false)
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {
        finished ? (
          <Text style={styles.message}>{winner}</Text>
        ) : (
          <Text style={styles.message}>{currentSide} Turn</Text>
        )
      }
      <View style={styles.tttBoard}>
        <Row>
          {rowOne}
        </Row>
        <Row>
          {rowTwo}
        </Row>
        <Row>
          {rowThree}
        </Row>
      </View>
      <TouchableHighlight style={styles.resetBtn} title="Reset" color="#841584" onPress={resetBoard}>
        <Text style={styles.btnText}>Reset</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 400,
    backgroundColor: "yellow",
  },
  message: {
    fontSize: 50,
    fontWeight: "bold",
    margin: 20,
  },
  tttBoard: {
    height: 300,
    width: 300,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    height: 100,
  },
  field: {
    flex: 1,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 10,
    transition: "transform 2s",
  },
  fieldText: {
    height: 90,
    width: 90,
    textAlign: "center",
    textAlignVertical: "center",
    color: "white",
    fontSize: 70,
    fontWeight: "bold",
  },
  resetBtn: {
    margin: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    borderRadius: 5,
  },
  btnText: {
    color: "white",
    fontSize: 20,
  }
});
