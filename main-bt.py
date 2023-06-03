import random
import pprint as pp


class board:
    def __init__(self):
        self.board = [[None for _ in range(8)] for _ in range(8)]
        self.list_kapal = {'C': 5, 'S': 1, 'D': 3}
        self.NoMissFlag = False
        self.lastHit = [0, 0]

    def attack(self, row, column):
        y = self.is_overlap(row, column)

        if y:
            return False, False,True
        elif not y:
            ApakahKena, tenggelamBool = self.is_hit(row, column)
            return ApakahKena, tenggelamBool, True

    def is_overlap(self, row, column):
        if self.board[row][column] != None and self.board[row][column] not in self.list_kapal:
            print("Kotak ini sudah di tembak")
            return True
        else:
            return False

    def is_sink(self, Kapal):
        self.list_kapal.__setitem__(Kapal, self.list_kapal.get(Kapal) - 1)
        if self.list_kapal.get('C') == 0:
            self.list_kapal.__setitem__('C', self.list_kapal.get('C') - 1)
            print("Carrier is sink")
            return True
        elif self.list_kapal.get('D') == 0:
            self.list_kapal.__setitem__('D', self.list_kapal.get('D') - 1)
            print("Destroyer is sink")
            return True
        elif self.list_kapal.get('S') == 0:
            self.list_kapal.__setitem__('S', self.list_kapal.get('S') - 1)
            print("Submarine is sink")
            return True
        else:
            return False

    def is_hit(self, row, column):
        if self.board[row][column] in self.list_kapal:
            print("On Hit")
            self.NoMissFlag = True
            statusTenggelam = self.is_sink(self.board[row][column])
            self.board[row][column] = 'X'
            return True, statusTenggelam
        else:
            print("No Hit")
            self.NoMissFlag = False
            self.board[row][column] = 'O'
            return False, False

    def isi_board(self):
        ship_list = ['C', 'S', 'D']
        ship_size = [5, 1, 3]
        ship_listPicker = 0
        while True:
            if ship_listPicker >= len(ship_list):
                break
            count = 0
            isiKapalFlag = False
            row = random.randint(0, 7)
            column = random.randint(0, 7)
            axis = random.randint(0, 1)


            if axis == 0:
                if row + ship_size[ship_listPicker] - 1 < len(self.board):
                    for i in range(row, row + ship_size[ship_listPicker]):
                        count = count + 1
                        if self.board[i][column] is not None:
                            break
                    if count == ship_size[ship_listPicker]:
                        isiKapalFlag = True
                    if isiKapalFlag is True:

                        for i in range(row, row + ship_size[ship_listPicker]):
                            a = ship_list[ship_listPicker]
                            self.board[i][column] = str(a)
                        ship_listPicker += 1

            if axis == 1:
                if column + ship_size[ship_listPicker] - 1 < len(self.board):
                    for i in range(column, column + ship_size[ship_listPicker]):
                        count = count + 1
                        if self.board[row][i] is not None:
                            break

                    if count == ship_size[ship_listPicker]:
                        isiKapalFlag = True

                    if isiKapalFlag:


                        for i in range(column, column + ship_size[ship_listPicker]):
                            a = ship_list[ship_listPicker]
                            self.board[row][i] = str(a)
                        ship_listPicker += 1


class AI:
    def __init__(self):
        self.langkahAI = [[None for _ in range(8)] for _ in range(8)]
        self.boardAI = [[None for _ in range(8)] for _ in range(8)]
        self.lastMove = [0, 0]
        self.firstContact = [0, 0]
        self.count = 0
        self.firstContactFlag = False
        self.firstContact = list(self.firstContact)

    def pick(self, onHitStatus=False, sinkStatus=False):
        
        if onHitStatus is False:
            if self.firstContactFlag is True:
                row,column = self.focusFire()
                return row,column
            elif self.firstContactFlag is False:
                row,column = self.normalMove()
                return row, column
            
        if onHitStatus is True:
            if self.firstContactFlag is False:
                if sinkStatus is True:
                    row, column = self.normalMove()
                    return row,column
                elif sinkStatus is False:
                    self.firstContactFlag = True
                    self.firstContact = self.lastMove
                    row,column =  self.focusFire()
                    return row,column
                
            elif self.firstContactFlag is True:
                if sinkStatus is True:
                    row,column =  self.normalMove()
                    self.firstContactFlag = False
                    self.firstContact = [0 , 0]
                    self.count = 0
                    return row,column
                
                elif sinkStatus is False:
                    row, column = self.focusFire()
                    return row,column


    def normalMove(self):
        while True:
            row = random.randint(0, 7)
            column = random.randint(0, 7)

            if self.langkahAI[row][column] is None:
                return row, column

    def focusFire(self):
        picky = self.firstContact
        picky = list(picky)

        if self.count <1:

            while True:
                if self.count > 1:
                    break

                # If Count == 0, Akan coba menembak ke arah Kanan dari First Contact
                if self.count == 0:
                    if picky[0] + 1 < len(self.langkahAI):
                        if self.langkahAI[picky[0] + 1][picky[1]] is None:
                            row = picky[0] + 1
                            column = picky[1]
                            return row, column
                        elif self.langkahAI[picky[0] + 1][picky[1]] == 'X':
                            picky[0] = picky[0] + 1
                        elif self.langkahAI[picky[0] + 1][picky[1]] == 'O':
                            self.count += 1
                            picky = self.firstContact
                    else:
                        self.count += 1
                        picky = self.firstContact

                # If Count == 1, Akan coba menembak ke arah Kiri dari First Contact
                elif self.count == 1:
                    if picky[0] - 1 >= 0:
                        if self.langkahAI[picky[0] - 1][picky[1]] is None:
                            row = picky[0] - 1
                            column = picky[1]
                            return row, column
                        elif self.langkahAI[picky[0] - 1][picky[1]] == 'X':
                            
                            picky[0] = picky[0] - 1
                        elif self.langkahAI[picky[0] - 1][picky[1]] == 'O':
                            self.count += 1
                            picky = self.firstContact

                    else:
                        self.count += 1
                        picky = self.firstContact

        if self.count > 1 and self.count < 4:
            while True:
                if self.count > 3:
                    break

                # If Count == 2, Akan coba menembak ke arah Kanan dari First Contact
                if self.count == 2:
                    if picky[1] + 1 < len(self.langkahAI):
                        if self.langkahAI[picky[0]][picky[1] + 1] is None:
                            row = picky[0]
                            column = picky[1] + 1
                            return row, column
                        elif self.langkahAI[picky[0]][picky[1] + 1] == 'X':
                            picky[1] = picky[1] + 1
                        elif self.langkahAI[picky[0]][picky[1] + 1] == 'O':
                            self.count += 1
                            picky = self.firstContact
                    else:
                        self.count += 1
                        picky = self.firstContact

                # If Count == 3, Akan coba menembak ke arah Kanan dari First Contact
                if self.count == 3:
                    if picky[1] - 1 < len(self.langkahAI):
                        if self.langkahAI[picky[0]][picky[1] - 1] is None:
                            row = picky[0]
                            column = picky[1] - 1
                            return row, column
                        elif self.langkahAI[picky[0]][picky[1] - 1] == 'X':
                            picky[1] = picky[1] - 1
                        elif self.langkahAI[picky[0]][picky[1] - 1] == 'O':
                            self.count += 1
                            picky = self.firstContact
                    else:
                        self.count += 1
                        picky = self.firstContact



board1 = board()
board2 = board()
ai = AI()
konter = 0
StartFlag = False


#Punya AI
onHitStatus = False
sinkStatus = False
overlapKah = False

#Punya Player
onHitStatus2 = False
sinkStatus2 = False
overlapKah2 = False

board1.isi_board()
board2.isi_board()

ai.boardAI = board2.board

# pp.pprint(board1.board)
gameplayStatus = False
print()
# pp.pprint(board2.board)
while True:
    if konter == 0:
        if StartFlag is False:
            StartFlag = True
            row, column = ai.pick()
            ai.lastMove = row,column
            gameplayStatus, sinkKah, isOverlap = board1.attack(row, column)
            onHitStatus = gameplayStatus
            sinkStatus = sinkKah
            overlapKah = isOverlap

        elif StartFlag is True:
            row, column = ai.pick(onHitStatus, sinkStatus)
            ai.lastMove = row,column
            gameplayStatus, sinkKah, isOverlap = board1.attack(row, column)
            onHitStatus = gameplayStatus
            sinkStatus = sinkKah
            overlapKah = isOverlap


        if gameplayStatus is True:
            ai.langkahAI[row][column] = "X"
        elif gameplayStatus is False:
            ai.langkahAI[row][column] = "O"


        print("LANGKAH AI: ")
        print(row,column)
        print()

    elif konter == 1:
        row = int(input("Row: "))
        column = int(input("Column: "))

        gameplayStatus, _, isOverlap = board2.attack(row, column)
        overlapKah2 = isOverlap

    if gameplayStatus is False or overlapKah is False:
        if konter == 0:
            konter = 1
        elif konter == 1:
            konter = 0

    print("Board Saya ")
    pp.pprint(board1.board)
    print()
    print("Board AI")
    pp.pprint(board2.board)


    print("\n")
    pp.pprint(ai.langkahAI)
    print(ai.firstContact)
    print(ai.firstContactFlag)
    print()