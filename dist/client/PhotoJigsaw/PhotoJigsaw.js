const runtimeUrl = window.elementoRuntimeUrl || 'https://elemento.online/lib/runtime.js'
const Elemento = await import(runtimeUrl)
const {React, trace, elProps, stateProps, wrapFn} = Elemento

// MainPage.js
const MainPage_ChunksItem = React.memo(function MainPage_ChunksItem(props) {
    const pathTo = name => props.path + '.' + name
    const parentPathWith = name => Elemento.parentPath(props.path) + '.' + name
    const {$item, $itemId, $index, $selected, onClick} = props
    const {ItemSetItem, Block, Icon} = Elemento.components
    const {If, Eq, Floor} = Elemento.globalFunctions
    const _state = Elemento.useGetStore()
    const SelectedPiece = _state.useObject(parentPathWith('SelectedPiece'))
    const Width = _state.useObject(parentPathWith('Width'))
    const PictureUrl = _state.useObject(parentPathWith('PictureUrl'))
    const ImageChunk = _state.setObject(pathTo('ImageChunk'), new Block.State(stateProps(pathTo('ImageChunk')).props))
    const canDragItem = undefined
    const styles = elProps(pathTo('Chunks.Styles')).borderColor(If(Eq($itemId, SelectedPiece), 'orange', 'transparent')).width(100 / Width + '%').aspectRatio('1').boxSizing('border-box').borderStyle('solid').borderWidth('2').position('relative').props

    return React.createElement(ItemSetItem, {path: props.path, item: $item, itemId: $itemId, index: $index, onClick, canDragItem, styles},
        React.createElement(Block, elProps(pathTo('ImageChunk')).layout('vertical').styles(elProps(pathTo('ImageChunk.Styles')).backgroundImage(PictureUrl).height('100%').width('100%').backgroundColor('lightgray').backgroundPositionX(-($item % Width) * 100 + '%').backgroundPositionY(-Floor($item / Width) * 100 + '%').backgroundSize(Width * 100 + '%').props).props),
        React.createElement(Icon, elProps(pathTo('OkIndicator')).iconName('check').show(Eq($item, $itemId)).styles(elProps(pathTo('OkIndicator.Styles')).color('green').backgroundColor('white').position('absolute').bottom('0').right('0').fontSize('16').borderRadius('50%').props).props),
    )
})


function MainPage(props) {
    const pathTo = name => props.path + '.' + name
    const {Page, Data, Calculation, Timer, TextElement, Dialog, Button, Block, ItemSet} = Elemento.components
    const {Eq, Or, Not, Max, Shuffle, Range, If, WithoutItems, Len, RandomFrom, FlatList, Count, ItemAt, Ceiling, IsNull} = Elemento.globalFunctions
    const {Set, Reset, Update} = Elemento.appFunctions
    const _state = Elemento.useGetStore()
    const app = _state.useObject('PhotoJigsaw')
    const {FileUrl} = app
    const Status = _state.setObject(pathTo('Status'), new Data.State(stateProps(pathTo('Status')).value('Ready').props))
    const Score = _state.setObject(pathTo('Score'), new Data.State(stateProps(pathTo('Score')).value(0).props))
    const RoundSkipped = _state.setObject(pathTo('RoundSkipped'), new Data.State(stateProps(pathTo('RoundSkipped')).value(false).props))
    const GameRunning = _state.setObject(pathTo('GameRunning'), new Calculation.State(stateProps(pathTo('GameRunning')).value(Or(Status == 'Playing', Status == 'Paused')).props))
    const EndGame = _state.setObject(pathTo('EndGame'), React.useCallback(wrapFn(pathTo('EndGame'), 'calculation', () => {
        return Set(Status, 'Ended')
    }), [Status]))
    const Width = _state.setObject(pathTo('Width'), new Data.State(stateProps(pathTo('Width')).value(5).props))
    const Height = _state.setObject(pathTo('Height'), new Data.State(stateProps(pathTo('Height')).value('5').props))
    const NumberOfPieces = _state.setObject(pathTo('NumberOfPieces'), new Calculation.State(stateProps(pathTo('NumberOfPieces')).value(Width * Height).props))
    const MovesAllowed = _state.setObject(pathTo('MovesAllowed'), new Calculation.State(stateProps(pathTo('MovesAllowed')).value(50).props))
    const PointsPerPiece = _state.setObject(pathTo('PointsPerPiece'), new Calculation.State(stateProps(pathTo('PointsPerPiece')).value(2).props))
    const PictureNames = _state.setObject(pathTo('PictureNames'), new Calculation.State(stateProps(pathTo('PictureNames')).value(['Car1.jpg', 'car2.jpg', 'city1.jpg', 'cocktails.jpg', 'coffee1.jpg', 'icecream.jpg', 'mountains1.jpg', 'mountains2.jpg', 'mountains3.jpg', 'whitehelmet.jpg']).props))
    const PicturesUsed = _state.setObject(pathTo('PicturesUsed'), new Data.State(stateProps(pathTo('PicturesUsed')).value([]).props))
    const GetNextPicture = _state.setObject(pathTo('GetNextPicture'), React.useCallback(wrapFn(pathTo('GetNextPicture'), 'calculation', () => {
        let picsAvail = WithoutItems(PictureNames, PicturesUsed)
        let picsToChoose = If(Len(picsAvail) > 0, picsAvail, PictureNames)
        let pic = RandomFrom(picsToChoose)
        Set(PicturesUsed, FlatList(PicturesUsed, pic))
        return pic
    }), [PictureNames, PicturesUsed]))
    const TimeLimit = _state.setObject(pathTo('TimeLimit'), new Data.State(stateProps(pathTo('TimeLimit')).value(180).props))
    const GameTimer_endAction = React.useCallback(wrapFn(pathTo('GameTimer'), 'endAction', async ($timer) => {
        await EndGame()
    }), [EndGame])
    const GameTimer = _state.setObject(pathTo('GameTimer'), new Timer.State(stateProps(pathTo('GameTimer')).period(TimeLimit).interval(1).endAction(GameTimer_endAction).props))
    const PauseGame = _state.setObject(pathTo('PauseGame'), React.useCallback(wrapFn(pathTo('PauseGame'), 'calculation', () => {
        Set(Status, 'Paused')
        return GameTimer.Stop()
    }), [Status, GameTimer]))
    const ContinueGame = _state.setObject(pathTo('ContinueGame'), React.useCallback(wrapFn(pathTo('ContinueGame'), 'calculation', () => {
        Set(Status, 'Playing')
        return GameTimer.Start()
    }), [Status, GameTimer]))
    const Picture = _state.setObject(pathTo('Picture'), new Data.State(stateProps(pathTo('Picture')).props))
    const PictureUrl = _state.setObject(pathTo('PictureUrl'), new Calculation.State(stateProps(pathTo('PictureUrl')).value(`url(${FileUrl(Picture)})`).props))
    const Pieces = _state.setObject(pathTo('Pieces'), new Data.State(stateProps(pathTo('Pieces')).value(Range(0, Width * Height - 1)).props))
    const SelectedPiece = _state.setObject(pathTo('SelectedPiece'), new Data.State(stateProps(pathTo('SelectedPiece')).value(null).props))
    const ShowPuzzle = _state.setObject(pathTo('ShowPuzzle'), new Data.State(stateProps(pathTo('ShowPuzzle')).value(false).props))
    const Moves = _state.setObject(pathTo('Moves'), new Data.State(stateProps(pathTo('Moves')).value(0).props))
    const MovesRemaining = _state.setObject(pathTo('MovesRemaining'), new Calculation.State(stateProps(pathTo('MovesRemaining')).value(Max(MovesAllowed - Moves, 0)).props))
    const IsRoundFailed = _state.setObject(pathTo('IsRoundFailed'), new Calculation.State(stateProps(pathTo('IsRoundFailed')).value(Eq(MovesRemaining, 0)).props))
    const SetupNewRound = _state.setObject(pathTo('SetupNewRound'), React.useCallback(wrapFn(pathTo('SetupNewRound'), 'calculation', () => {
        Set(Picture, GetNextPicture())
        Set(Pieces, Shuffle(Range(0, Width * Height - 1)))
        return Reset(Moves, ShowPuzzle)
    }), [Picture, GetNextPicture, Pieces, Width, Height, Moves, ShowPuzzle]))
    const StartNewRound = _state.setObject(pathTo('StartNewRound'), React.useCallback(wrapFn(pathTo('StartNewRound'), 'calculation', () => {
        Reset(RoundSkipped)
        return SetupNewRound()
    }), [RoundSkipped, SetupNewRound]))
    const StartNewGame = _state.setObject(pathTo('StartNewGame'), React.useCallback(wrapFn(pathTo('StartNewGame'), 'calculation', () => {
        Reset(Score)
        Reset(GameTimer)
        Set(Status, 'Playing')
        StartNewRound()
        return GameTimer.Start()
    }), [Score, GameTimer, Status, StartNewRound]))
    const NumberCorrect = _state.setObject(pathTo('NumberCorrect'), new Calculation.State(stateProps(pathTo('NumberCorrect')).value(Count(Pieces, ($item, $index) => $item == $index)).props))
    const IsRoundWon = _state.setObject(pathTo('IsRoundWon'), new Calculation.State(stateProps(pathTo('IsRoundWon')).value(Eq(NumberCorrect, NumberOfPieces)).props))
    const IsRoundComplete = _state.setObject(pathTo('IsRoundComplete'), new Calculation.State(stateProps(pathTo('IsRoundComplete')).value(Or(IsRoundWon, IsRoundFailed, RoundSkipped, Not(GameRunning))).props))
    const RoundInPlay = _state.setObject(pathTo('RoundInPlay'), new Calculation.State(stateProps(pathTo('RoundInPlay')).value(Not(IsRoundComplete)).props))
    const Points = _state.setObject(pathTo('Points'), React.useCallback(wrapFn(pathTo('Points'), 'calculation', () => {
        let points = NumberCorrect * PointsPerPiece
        let bonus = If(IsRoundWon, points, 0)
        return points + bonus
    }), [NumberCorrect, PointsPerPiece, IsRoundWon]))
    const EndRound = _state.setObject(pathTo('EndRound'), React.useCallback(wrapFn(pathTo('EndRound'), 'calculation', () => {
        Set(Score, Score + Points())
        return If(RoundSkipped, () => StartNewRound())
    }), [Score, Points, RoundSkipped, StartNewRound]))
    const WhenRoundComplete_whenTrueAction = React.useCallback(wrapFn(pathTo('WhenRoundComplete'), 'whenTrueAction', async () => {
        await EndRound()
    }), [EndRound])
    const WhenRoundComplete = _state.setObject(pathTo('WhenRoundComplete'), new Calculation.State(stateProps(pathTo('WhenRoundComplete')).value(IsRoundComplete).whenTrueAction(WhenRoundComplete_whenTrueAction).props))
    const SwapSelected = _state.setObject(pathTo('SwapSelected'), React.useCallback(wrapFn(pathTo('SwapSelected'), 'calculation', (selected2) => {
        let piece1 = ItemAt(Pieces, SelectedPiece)
        let piece2 = ItemAt(Pieces, selected2)
        Update(Pieces, {[SelectedPiece.value]: piece2, [selected2]: piece1})
        Reset(SelectedPiece)
        return Set(Moves, Moves + 1)
    }), [Pieces, SelectedPiece, Moves]))
    const Instructions = _state.setObject(pathTo('Instructions'), new Dialog.State(stateProps(pathTo('Instructions')).initiallyOpen(false).props))
    const StatsLayout = _state.setObject(pathTo('StatsLayout'), new Block.State(stateProps(pathTo('StatsLayout')).props))
    const ReadyPanel = _state.setObject(pathTo('ReadyPanel'), new Block.State(stateProps(pathTo('ReadyPanel')).props))
    const PlayPanel = _state.setObject(pathTo('PlayPanel'), new Block.State(stateProps(pathTo('PlayPanel')).props))
    const PhotoGrid = _state.setObject(pathTo('PhotoGrid'), new Block.State(stateProps(pathTo('PhotoGrid')).props))
    const Chunks_selectAction = React.useCallback(wrapFn(pathTo('Chunks'), 'selectAction', async ($item, $itemId, $index) => {
        If(RoundInPlay, async () => If(IsNull(SelectedPiece), () => Set(SelectedPiece, $itemId), async () => await SwapSelected($itemId)))
    }), [RoundInPlay, SelectedPiece, SwapSelected])
    const Chunks = _state.setObject(pathTo('Chunks'), new ItemSet.State(stateProps(pathTo('Chunks')).items(Pieces).selectable('none').selectAction(Chunks_selectAction).props))
    const PhotoOriginal = _state.setObject(pathTo('PhotoOriginal'), new Block.State(stateProps(pathTo('PhotoOriginal')).props))
    const RoundStatusBlock = _state.setObject(pathTo('RoundStatusBlock'), new Block.State(stateProps(pathTo('RoundStatusBlock')).props))
    const EndedPanel = _state.setObject(pathTo('EndedPanel'), new Block.State(stateProps(pathTo('EndedPanel')).props))
    const RoundControls = _state.setObject(pathTo('RoundControls'), new Block.State(stateProps(pathTo('RoundControls')).props))
    const PausePanel = _state.setObject(pathTo('PausePanel'), new Block.State(stateProps(pathTo('PausePanel')).props))
    const GameControls = _state.setObject(pathTo('GameControls'), new Block.State(stateProps(pathTo('GameControls')).props))
    const StartGame2_action = React.useCallback(wrapFn(pathTo('StartGame2'), 'action', async () => {
        await StartNewGame()
        await Instructions.Close()
    }), [StartNewGame, Instructions])
    const NewRound_action = React.useCallback(wrapFn(pathTo('NewRound'), 'action', async () => {
        await StartNewRound()
    }), [StartNewRound])
    const ShowPuzzle_action = React.useCallback(wrapFn(pathTo('ShowPuzzle'), 'action', () => {
        Set(ShowPuzzle, true)
    }), [])
    const ShowOriginal_action = React.useCallback(wrapFn(pathTo('ShowOriginal'), 'action', () => {
        Set(ShowPuzzle, false)
    }), [ShowPuzzle])
    const SkipRound_action = React.useCallback(wrapFn(pathTo('SkipRound'), 'action', () => {
        Set(RoundSkipped, true)
    }), [RoundSkipped])
    const StartGame_action = React.useCallback(wrapFn(pathTo('StartGame'), 'action', async () => {
        await StartNewGame()
    }), [StartNewGame])
    const StopGame_action = React.useCallback(wrapFn(pathTo('StopGame'), 'action', async () => {
        await EndGame()
    }), [EndGame])
    const PauseGame_action = React.useCallback(wrapFn(pathTo('PauseGame'), 'action', async () => {
        await PauseGame()
    }), [])
    const ContinueGame_action = React.useCallback(wrapFn(pathTo('ContinueGame'), 'action', async () => {
        await ContinueGame()
    }), [])
    const Instructions_action = React.useCallback(wrapFn(pathTo('Instructions'), 'action', async () => {
        await Instructions.Show()
    }), [])
    Elemento.elementoDebug(() => eval(Elemento.useDebugExpr()))

    return React.createElement(Page, elProps(props.path).props,
        React.createElement(Data, elProps(pathTo('Status')).display(false).props),
        React.createElement(Data, elProps(pathTo('Score')).display(false).props),
        React.createElement(Data, elProps(pathTo('RoundSkipped')).display(false).props),
        React.createElement(Calculation, elProps(pathTo('IsRoundWon')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('IsRoundFailed')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('WhenRoundComplete')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('IsRoundComplete')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('RoundInPlay')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('MovesRemaining')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('GameRunning')).show(false).props),
        React.createElement(Timer, elProps(pathTo('GameTimer')).show(false).props),
        React.createElement(TextElement, elProps(pathTo('Title')).styles(elProps(pathTo('Title.Styles')).fontSize(24).fontFamily('Impact').color('Orange').letterSpacing('2px').props).content('Photo Jigsaw').props),
        React.createElement(Data, elProps(pathTo('Width')).display(false).props),
        React.createElement(Data, elProps(pathTo('Height')).display(false).props),
        React.createElement(Calculation, elProps(pathTo('NumberOfPieces')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('MovesAllowed')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('PointsPerPiece')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('PictureNames')).show(false).props),
        React.createElement(Data, elProps(pathTo('PicturesUsed')).display(false).props),
        React.createElement(Data, elProps(pathTo('TimeLimit')).display(false).props),
        React.createElement(Data, elProps(pathTo('Picture')).display(false).props),
        React.createElement(Calculation, elProps(pathTo('PictureUrl')).show(false).props),
        React.createElement(Data, elProps(pathTo('Pieces')).display(false).props),
        React.createElement(Data, elProps(pathTo('SelectedPiece')).display(false).props),
        React.createElement(Data, elProps(pathTo('ShowPuzzle')).display(false).props),
        React.createElement(Data, elProps(pathTo('Moves')).display(false).props),
        React.createElement(Calculation, elProps(pathTo('NumberCorrect')).show(false).props),
        React.createElement(Dialog, elProps(pathTo('Instructions')).layout('vertical').showCloseButton(true).styles(elProps(pathTo('Instructions.Styles')).padding('2em').props).props,
            React.createElement(TextElement, elProps(pathTo('InstructionsText')).allowHtml(true).content(`Move the jumbled pieces of a picture into the correct positions.


Study the original first - but not too long, the timer is running.  Then click Show Puzzle to start.  You can click Show Original later to switch between the two.


Click on two pieces one after the other to swap their positions. You have up to ${MovesAllowed} moves on a picture.


You score ${PointsPerPiece} points for each piece in the right position (tick in the corner), and double if you get them all correct.


If you get stuck and want to try another picture, click Skip this picture - you keep any points you have.


You have 3 minutes - and if you finish the first one, click New Picture to start another.
`).props),
            React.createElement(Button, elProps(pathTo('StartGame2')).content('Start Game').appearance('filled').show(Not(GameRunning)).action(StartGame2_action).props),
    ),
        React.createElement(Block, elProps(pathTo('StatsLayout')).layout('horizontal wrapped').styles(elProps(pathTo('StatsLayout.Styles')).fontSize('24').justifyContent('space-between').width('100%').props).props,
            React.createElement(TextElement, elProps(pathTo('ScoreDisplay')).show(Or(GameRunning, Status == 'Ended')).styles(elProps(pathTo('ScoreDisplay.Styles')).fontSize('inherit').color('blue').props).content('Total points ' + Score).props),
            React.createElement(TextElement, elProps(pathTo('TimeDisplay')).show(GameRunning).styles(elProps(pathTo('TimeDisplay.Styles')).fontSize('inherit').color('green').props).content(Ceiling(GameTimer. remainingTime) + 's left').props),
            React.createElement(TextElement, elProps(pathTo('GameOver')).show(Status == 'Ended').styles(elProps(pathTo('GameOver.Styles')).fontSize('inherit').color('white').backgroundColor('green').padding('0 0.5em').borderRadius('8px').props).content('Game Over').props),
    ),
        React.createElement(Block, elProps(pathTo('ReadyPanel')).layout('vertical').show(Status == 'Ready').styles(elProps(pathTo('ReadyPanel.Styles')).padding('0').props).props,
            React.createElement(TextElement, elProps(pathTo('Title')).styles(elProps(pathTo('Title.Styles')).color('#039a03').fontFamily('Chelsea Market').fontSize('28').props).content('Welcome!').props),
            React.createElement(TextElement, elProps(pathTo('ReadyText')).styles(elProps(pathTo('ReadyText.Styles')).fontSize('20').props).content(`Move the chunks of a picture into the right positions.

View the original, then click Show Puzzle to start.

Click on two squares to swap them.

Click Instructions for full details

Or Start Game to dive straight in!`).props),
    ),
        React.createElement(Block, elProps(pathTo('PlayPanel')).layout('vertical').show(Or(Status == 'Playing', Status == 'Ended')).styles(elProps(pathTo('PlayPanel.Styles')).width('100%').padding('0').position('relative').maxWidth('400px').props).props,
            React.createElement(Block, elProps(pathTo('PhotoGrid')).layout('horizontal wrapped').show(ShowPuzzle).styles(elProps(pathTo('PhotoGrid.Styles')).width('100%').maxWidth('500px').aspectRatio(Width / Height).border('1px solid gray').gap('0').props).props,
            React.createElement(ItemSet, elProps(pathTo('Chunks')).itemContentComponent(MainPage_ChunksItem).props),
    ),
            React.createElement(Block, elProps(pathTo('PhotoOriginal')).layout('none').show(Not(ShowPuzzle)).styles(elProps(pathTo('PhotoOriginal.Styles')).width('100%').maxWidth('500px').aspectRatio(Width / Height).border('1px solid gray').backgroundImage(PictureUrl).backgroundSize('cover').props).props),
            React.createElement(Block, elProps(pathTo('RoundStatusBlock')).layout('horizontal').props,
            React.createElement(TextElement, elProps(pathTo('RoundInProgress')).allowHtml(true).show(RoundInPlay).content('Points so far ' + Points() + ' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Moves remaining ' + MovesRemaining).props),
            React.createElement(TextElement, elProps(pathTo('RoundWon')).show(IsRoundWon).content('All correct! ' + Points() + ' points added').props),
            React.createElement(TextElement, elProps(pathTo('RoundFailed')).allowHtml(false).show(IsRoundFailed).content('Sorry - no moves left').props),
            React.createElement(TextElement, elProps(pathTo('RoundSkipped')).show(RoundSkipped).content('Picture skipped - ' + Points() + ' points').props),
            React.createElement(Button, elProps(pathTo('NewRound')).content('New Picture').appearance('filled').show(Status == 'Playing' && IsRoundComplete).action(NewRound_action).props),
    ),
            React.createElement(Block, elProps(pathTo('EndedPanel')).layout('vertical').show(Status == 'Ended').styles(elProps(pathTo('EndedPanel.Styles')).position('absolute').left('50%').translate('-50% -50%').top('50%').backgroundColor('lightblue').padding('1em').borderRadius('10px').border('2px solid blue').opacity('1').minWidth('20em').props).props,
            React.createElement(TextElement, elProps(pathTo('Title')).styles(elProps(pathTo('Title.Styles')).fontFamily('fantasy, Arial').fontSize('28').color('#039a03').props).content('Congratulations!').props),
            React.createElement(TextElement, elProps(pathTo('Score')).content('You have scored ' + Score + ' points!').props),
            React.createElement(TextElement, elProps(pathTo('Whatnext')).content('Click Start Game to have another go').props),
    ),
            React.createElement(Block, elProps(pathTo('RoundControls')).layout('horizontal').styles(elProps(pathTo('RoundControls.Styles')).justifyContent('space-between').width('100%').props).props,
            React.createElement(Button, elProps(pathTo('ShowPuzzle')).content('Show Puzzle').appearance('filled').show(Not(ShowPuzzle)).action(ShowPuzzle_action).props),
            React.createElement(Button, elProps(pathTo('ShowOriginal')).content('Show Original').appearance('outline').show(ShowPuzzle).action(ShowOriginal_action).props),
            React.createElement(Button, elProps(pathTo('SkipRound')).content('Skip this picture').appearance('outline').show(RoundInPlay).action(SkipRound_action).props),
    ),
    ),
        React.createElement(Block, elProps(pathTo('PausePanel')).layout('vertical').show(Status == 'Paused').styles(elProps(pathTo('PausePanel.Styles')).padding('0').props).props,
            React.createElement(TextElement, elProps(pathTo('Title')).styles(elProps(pathTo('Title.Styles')).color('#7529df').fontFamily('Luckiest Guy').fontSize('28').props).content('Paused...').props),
            React.createElement(TextElement, elProps(pathTo('PauseText')).styles(elProps(pathTo('PauseText.Styles')).fontSize('20').props).content('Click Continue Game to carry on').props),
    ),
        React.createElement(Block, elProps(pathTo('GameControls')).layout('horizontal').styles(elProps(pathTo('GameControls.Styles')).paddingTop('20px').props).props,
            React.createElement(Button, elProps(pathTo('StartGame')).content('Start Game').appearance('filled').show(Not(GameRunning)).action(StartGame_action).props),
            React.createElement(Button, elProps(pathTo('StopGame')).content('Stop Game').appearance('outline').show(GameRunning).action(StopGame_action).props),
            React.createElement(Button, elProps(pathTo('PauseGame')).content('Pause Game').appearance('outline').show(Status == 'Playing').action(PauseGame_action).props),
            React.createElement(Button, elProps(pathTo('ContinueGame')).content('Continue Game').appearance('outline').show(Status == 'Paused').action(ContinueGame_action).props),
            React.createElement(Button, elProps(pathTo('Instructions')).content('Instructions').appearance('outline').action(Instructions_action).props),
    ),
    )
}

// appMain.js
export default function PhotoJigsaw(props) {
    const pathTo = name => 'PhotoJigsaw' + '.' + name
    const {App} = Elemento.components
    const pages = {MainPage}
    const appContext = Elemento.useGetAppContext()
    const _state = Elemento.useGetStore()
    const app = _state.setObject('PhotoJigsaw', new App.State({pages, appContext}))

    return React.createElement(App, {...elProps('PhotoJigsaw').maxWidth('500px').props},)
}
