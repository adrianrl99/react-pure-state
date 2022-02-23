import { Dispatch, FC, memo, NamedExoticComponent, Reducer, useReducer } from 'react'
import './App.css'

type State = {
  x: number,
  y: number,
  z: {
    a: number
  }
}
type Action = (state: State) => State
type AsyncAction<P extends PureProps = PureProps, R = unknown> = (props: P) => Promise<R>

type PureFC<P extends PureProps> = NamedExoticComponent<P>
interface PureProps {
  state?: State
  dispatch?: Dispatch<Action>
}
type PurePropsAreEqual<P extends PureProps> = (prevProps: P, nextProps: P) => boolean

/**
 * X Component
 */

interface XProps extends PureProps {}

const xPropsAreEqual: PurePropsAreEqual<XProps> =  (prevProps, nextProps) => 
  prevProps.state?.x === nextProps.state?.x 

const X: PureFC<XProps> = memo(({ state, dispatch }) => {
  console.log("render X", state?.x)

  const handleClick = () => dispatch?.((state) => {
    state.x = Math.random()
    return state;
  })

  return <button onClick={handleClick}>X</button>
}, xPropsAreEqual)


/**
 * Y Component
 */

interface YProps extends PureProps {}

const yPropsAreEqual: PurePropsAreEqual<YProps> =  (prevProps, nextProps) =>
  prevProps.state?.y === nextProps.state?.y

  // const updateYState: Action = async () => (state) => {
  //   state.y = Math.random()
  //   return state;
  // }

const actionYState: Action = (state) => {
  console.log('inside')
  state.y = Math.random()
  return state;
}

const updateYState: AsyncAction = async ({ dispatch }) => {
  dispatch?.(actionYState)
}

const Y: PureFC<YProps> = memo(({ state, dispatch }) => {
  console.log("render Y", state?.y)

  const handleClick = async () => {
    console.log('before change')
    await updateYState({ dispatch })
    console.log('after change')
  }

  return <button onClick={handleClick}>Y</button>
}, yPropsAreEqual)

/**
 * A Component
 */

 interface AProps extends PureProps {}

 const aPropsAreEqual: PurePropsAreEqual<AProps> =  (prevProps, nextProps) => 
   prevProps.state?.z.a === nextProps.state?.z.a
 
   const A: PureFC<AProps> = memo(({ state, dispatch }) => {
     console.log("render A", state?.z.a)
   
     const handleClick = () => dispatch?.((state) => {
       state.z.a = Math.random()
       return state;
     })
   
     return <button onClick={handleClick}>A</button>
   }, aPropsAreEqual)

/**
 * Z Component
 */

 interface ZProps extends PureProps {}

 const zPropsAreEqual: PurePropsAreEqual<ZProps> =  (prevProps, nextProps) => 
   JSON.stringify(prevProps.state?.z) === JSON.stringify(nextProps.state?.z)
 
   const Z: PureFC<ZProps> = memo(({ state, dispatch }) => {
     console.log("render Z", state?.z)
   
     return <A state={state} dispatch={dispatch} />
   }, zPropsAreEqual)


const initalState: State = {
  x: 1,
  y: 2,
  z: {
    a: 3
  }
}

const reducer: Reducer<State, Action> = (state, action) => {
  const stateCloned = JSON.parse(JSON.stringify(state))
  const newState = action(stateCloned)

  return newState ?? state
}

const App: FC = () => {
  const [state, dispatch] = useReducer(reducer, initalState);

  console.log("render App", state)

  return (
    <main>
      {console.time('time')}
      <X state={state} dispatch={dispatch} />
      <Y state={state} dispatch={dispatch} />
      <Z state={state} dispatch={dispatch} />
      {console.timeEnd('time')}
    </main>
  )
}

export default App
