const runtimeUrl = window.elementoRuntimeUrl || 'https://elemento.online/lib/runtime.js'
const Elemento = await import(runtimeUrl)
const {React} = Elemento

// MainPage.js
const MainPage_ChunksItem = React.memo(function MainPage_ChunksItem(props) {
    const pathWith = name => props.path + '.' + name
    const parentPathWith = name => Elemento.parentPath(props.path) + '.' + name
    const {$item, $selected, onClick} = props
    const {ItemSetItem, Block} = Elemento.components
    const {Floor} = Elemento.globalFunctions
    const _state = Elemento.useGetStore()
    const Width = _state.useObject(parentPathWith('Width'))
    const styles = undefined

    return React.createElement(ItemSetItem, {path: props.path, onClick, styles},
        React.createElement(Block, {path: pathWith('ImageChunk'), styles: {backgroundImage: 'url(../files/Car1.jpg)', height: '100', width: '100', backgroundColor: 'lightgray', backgroundPositionX: -($item % Width) * 100 + 'px', backgroundPositionY: -Floor($item / Width) * 100 + 'px'}},

    ),
    )
})


function MainPage(props) {
    const pathWith = name => props.path + '.' + name
    const {Page, TextElement, Data, Image, Button, Layout, ItemSet} = Elemento.components
    const {Range, ItemAt, Shuffle, Log, If, IsNull} = Elemento.globalFunctions
    const {Update, Reset, Set} = Elemento.appFunctions
    const _state = Elemento.useGetStore()
    const Width = _state.setObject(pathWith('Width'), new Data.State({value: '5'}))
    const Height = _state.setObject(pathWith('Height'), new Data.State({value: '5'}))
    const Pieces = _state.setObject(pathWith('Pieces'), new Data.State({value: Range(0, Width * Height - 1)}))
    const Selected1 = _state.setObject(pathWith('Selected1'), new Data.State({value: null}))
    const SwapSelected = React.useCallback((selected2) => {
        let piece1 = ItemAt(Pieces, Selected1)
        let piece2 = ItemAt(Pieces, selected2)
        Update(Pieces, {[Selected1.value]: piece2, [selected2]: piece1})
        return Reset(Selected1)
    }, [Pieces, Selected1])
    const Chunks_selectAction = React.useCallback(async ($item, $itemId) => {
        Log('select', $item, $itemId)
        If(IsNull(Selected1), () => Set(Selected1, $itemId), async () => await SwapSelected($itemId))
    }, [Selected1, SwapSelected])
    const Chunks = _state.setObject(pathWith('Chunks'), new ItemSet.State({items: Pieces, selectable: 'none', selectAction: Chunks_selectAction}))
    const Start_action = React.useCallback(() => {
        Set(Pieces, Shuffle(Range(0, Width * Height - 1)))
    }, [Pieces, Width, Height])
    Elemento.elementoDebug(eval(Elemento.useDebugExpr()))

    return React.createElement(Page, {path: props.path},
        React.createElement(TextElement, {path: pathWith('Title'), styles: {fontSize: 24, fontFamily: 'Impact', color: 'Orange', letterSpacing: '2px'}}, 'Photo Jigsaw'),
        React.createElement(Data, {path: pathWith('Width'), display: false}),
        React.createElement(Data, {path: pathWith('Height'), display: false}),
        React.createElement(Data, {path: pathWith('Pieces'), display: true}),
        React.createElement(Data, {path: pathWith('Selected1'), display: true}),
        React.createElement(Image, {path: pathWith('Image1'), source: 'Car1.jpg', show: false}),
        React.createElement(Button, {path: pathWith('Start'), content: 'Start', appearance: 'outline', action: Start_action}),
        React.createElement(Layout, {path: pathWith('Layout1'), horizontal: true, wrap: true, styles: {width: '515', height: '515', gap: '3px'}},
            React.createElement(ItemSet, {path: pathWith('Chunks'), itemContentComponent: MainPage_ChunksItem}),
    ),
    )
}

// appMain.js
export default function MainApp(props) {
    const pathWith = name => 'MainApp' + '.' + name
    const {App} = Elemento.components
    const pages = {MainPage}
    const {appContext} = props
    const _state = Elemento.useGetStore()
    const app = _state.setObject('app', new App.State({pages, appContext}))

    return React.createElement(App, {path: 'MainApp', },)
}
