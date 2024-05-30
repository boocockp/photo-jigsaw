const runtimeUrl = window.elementoRuntimeUrl || 'https://elemento.online/lib/runtime.js'
const Elemento = await import(runtimeUrl)
const {React} = Elemento

// MainPage.js
const MainPage_ChunksItem = React.memo(function MainPage_ChunksItem(props) {
    const pathWith = name => props.path + '.' + name
    const parentPathWith = name => Elemento.parentPath(props.path) + '.' + name
    const {$item, $itemId, $selected, onClick} = props
    const {ItemSetItem, Block, Icon} = Elemento.components
    const {If, Eq, Floor} = Elemento.globalFunctions
    const _state = Elemento.useGetStore()
    const app = _state.useObject('MainApp')
    const {FileUrl} = app
    const SelectedPiece = _state.useObject(parentPathWith('SelectedPiece'))
    const Width = _state.useObject(parentPathWith('Width'))
    const styles = undefined

    return React.createElement(ItemSetItem, {path: props.path, onClick, styles},
        React.createElement(Block, {path: pathWith('ChunkWrapper'), styles: {height: '100', width: '100', borderColor: If(Eq($itemId, SelectedPiece), 'orange', 'transparent'), borderStyle: 'solid', borderWidth: '3'}},
            React.createElement(Icon, {path: pathWith('OkIndicator'), iconName: 'check', show: Eq($item, $itemId), styles: {color: 'green', backgroundColor: 'white', position: 'absolute', zIndex: 1, bottom: '0', right: '0', fontSize: '16', borderRadius: '50%'}}),
            React.createElement(Block, {path: pathWith('ImageChunk'), styles: {backgroundImage: 'url(' + FileUrl('Car1.jpg') + ')', height: '100', width: '100', backgroundColor: 'lightgray', backgroundPositionX: -($item % Width) * 100 + 'px', backgroundPositionY: -Floor($item / Width) * 100 + 'px'}},

    ),
    ),
    )
})


function MainPage(props) {
    const pathWith = name => props.path + '.' + name
    const {Page, TextElement, Data, Calculation, Timer, Image, Button, Layout, ItemSet} = Elemento.components
    const {Range, Count, Eq, Or, Log, ItemAt, If, Shuffle, Ceiling, IsNull} = Elemento.globalFunctions
    const {Update, Reset, Set} = Elemento.appFunctions
    const _state = Elemento.useGetStore()
    const Width = _state.setObject(pathWith('Width'), new Data.State({value: 5}))
    const Height = _state.setObject(pathWith('Height'), new Data.State({value: '5'}))
    const TimeLimit = _state.setObject(pathWith('TimeLimit'), new Data.State({value: 180}))
    const Pieces = _state.setObject(pathWith('Pieces'), new Data.State({value: Range(0, Width * Height - 1)}))
    const SelectedPiece = _state.setObject(pathWith('SelectedPiece'), new Data.State({value: null}))
    const Moves = _state.setObject(pathWith('Moves'), new Data.State({value: 0}))
    const NumberCorrect = _state.setObject(pathWith('NumberCorrect'), new Calculation.State({value: Count(Pieces, ($item, $index) => $item == $index)}))
    const AllCorrect = _state.setObject(pathWith('AllCorrect'), new Calculation.State({value: Eq(NumberCorrect, Count(Pieces))}))
    const GameTimer = _state.setObject(pathWith('GameTimer'), new Timer.State({period: TimeLimit, interval: 1}))
    const GameOver_whenTrueAction = React.useCallback(async () => {
        Log('Game over!')
        await GameTimer.Stop()
    }, [GameTimer])
    const GameOver = _state.setObject(pathWith('GameOver'), new Calculation.State({value: Or(GameTimer.isFinished , AllCorrect), whenTrueAction: GameOver_whenTrueAction}))
    const CheckScores = React.useCallback(() => {
        return If(AllCorrect, () => GameTimer.Stop())
    }, [AllCorrect, GameTimer])
    const SwapSelected = React.useCallback((selected2) => {
        let piece1 = ItemAt(Pieces, SelectedPiece)
        let piece2 = ItemAt(Pieces, selected2)
        Update(Pieces, {[SelectedPiece.value]: piece2, [selected2]: piece1})
        Reset(SelectedPiece)
        Set(Moves, Moves + 1)
        return CheckScores()
    }, [Pieces, SelectedPiece, Moves, CheckScores])
    const Chunks_selectAction = React.useCallback(async ($item, $itemId) => {
        Log('select', $item, $itemId)
        If(IsNull(SelectedPiece), () => Set(SelectedPiece, $itemId), async () => await SwapSelected($itemId))
    }, [SelectedPiece, SwapSelected])
    const Chunks = _state.setObject(pathWith('Chunks'), new ItemSet.State({items: Pieces, selectable: 'none', selectAction: Chunks_selectAction}))
    const Start_action = React.useCallback(async () => {
        Set(Pieces, Shuffle(Range(0, Width * Height - 1)))
        Reset(Moves)
        await GameTimer.Reset()
        await GameTimer.Start()
    }, [Pieces, Width, Height, Moves, GameTimer])
    Elemento.elementoDebug(eval(Elemento.useDebugExpr()))

    return React.createElement(Page, {path: props.path},
        React.createElement(TextElement, {path: pathWith('Title'), styles: {fontSize: 24, fontFamily: 'Impact', color: 'Orange', letterSpacing: '2px'}}, 'Photo Jigsaw'),
        React.createElement(Data, {path: pathWith('Width'), display: false}),
        React.createElement(Data, {path: pathWith('Height'), display: false}),
        React.createElement(Data, {path: pathWith('TimeLimit'), display: false}),
        React.createElement(Data, {path: pathWith('Pieces'), display: false}),
        React.createElement(Data, {path: pathWith('SelectedPiece'), display: false}),
        React.createElement(Data, {path: pathWith('Moves'), display: false}),
        React.createElement(Calculation, {path: pathWith('NumberCorrect'), show: false}),
        React.createElement(Calculation, {path: pathWith('AllCorrect'), show: false}),
        React.createElement(Calculation, {path: pathWith('GameOver'), show: false}),
        React.createElement(Timer, {path: pathWith('GameTimer'), label: 'Time', show: false}),
        React.createElement(Image, {path: pathWith('Image1'), source: 'Car1.jpg', show: false}),
        React.createElement(Button, {path: pathWith('Start'), content: 'Start', appearance: 'outline', action: Start_action}),
        React.createElement(Layout, {path: pathWith('StatusLine'), horizontal: true, wrap: false, styles: {fontSize: '20px'}},
            React.createElement(TextElement, {path: pathWith('MovesTaken'), styles: {fontSize: 'inherit'}}, 'Moves: ' +  Moves),
            React.createElement(TextElement, {path: pathWith('TimeLeft'), styles: {fontSize: 'inherit', marginLeft: '6em'}}, 'Remaining: ' + Ceiling(TimeLimit - GameTimer.value) + ' seconds'),
    ),
        React.createElement(Layout, {path: pathWith('Layout1'), horizontal: true, wrap: true, styles: {width: '530', height: '515', gap: '0'}},
            React.createElement(ItemSet, {path: pathWith('Chunks'), itemContentComponent: MainPage_ChunksItem}),
    ),
    )
}

// appMain.js
export default function MainApp(props) {
    const pathWith = name => 'MainApp' + '.' + name
    const {App} = Elemento.components
    const pages = {MainPage}
    const appContext = Elemento.useGetAppContext()
    const _state = Elemento.useGetStore()
    const app = _state.setObject('MainApp', new App.State({pages, appContext}))

    return React.createElement(App, {path: 'MainApp', },)
}
