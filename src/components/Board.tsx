import range from "lodash.range";
import { Component, createSignal, For, Index, Match, Switch } from "solid-js";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type BoardComponent = Component<{
  board: number[],
  width: number,
  height: number,
  lastMove: number | null,
  turn: number,
  play: (i: number) => void,
}>

const Board: BoardComponent = props => {
  const [hover, setHover] = createSignal<number | null>(null);

  const points = [[7, 7], [3, 3], [11, 3], [3, 11], [11, 11]];

  return (
    <div class="bg-seamless h-[45rem] w-[45rem] border-4 border-black rounded-3xl relative">
      <div class="absolute w-full h-full">
        <svg viewBox="-70 -70 1140 1140" class="select-none">
          <For each={range(0, props.width)}>
            {i =>
              <>
                <line
                  x1="0"
                  x2="1000"
                  y1={1000 * i / (props.height - 1)}
                  y2={1000 * i / (props.height - 1)}
                  stroke="black"
                  stroke-width="1"
                />
                <text
                  x="-50"
                  y={1000 * i / (props.height - 1)}
                  class="boardtext"
                >
                  {props.width - i}
                </text>
                <text
                  x="1050"
                  y={1000 * i / (props.height - 1)}
                  class="boardtext"
                >
                  {props.width - i}
                </text>
              </>
            }
          </For>
          <For each={range(0, props.height)}>
            {i =>
              <>
                <line
                  y1="0"
                  y2="1000"
                  x1={1000 * i / (props.height - 1)}
                  x2={1000 * i / (props.height - 1)}
                  stroke="black"
                  stroke-width="1"
                />
                <text
                  y="-50"
                  x={1000 * i / (props.height - 1)}
                  class="boardtext"
                >
                  {alphabet[i]}
                </text>
                <text
                  y="1050"
                  x={1000 * i / (props.height - 1)}
                  class="boardtext"
                >
                  {alphabet[i]}
                </text>
              </>
            }
          </For>
          <For each={points}>
            {([x, y]) => (
              <circle
                cx={1000 * x / (props.width - 1)}
                cy={1000 * y / (props.height - 1)}
                r="5"
                fill="black"
              />
            )}
          </For>
        </svg>
        <Index each={props.board}>
          {(c, i) => (
            <div
              class="absolute flex"
              style={{
                left: `${40 * 100 / 1140 + (i % props.width) / (props.width - 1) * 10000 / 114}%`,
                top: `${40 * 100 / 1140 + (i / props.width | 0) / (props.height - 1) * 10000 / 114}%`,
                width: `${60 * 100 / 1140}%`,
                height: `${60 * 100 / 1140}%`,
              }}
              onClick={[props.play, i]}
              onPointerEnter={[setHover, i]}
              onPointerLeave={[setHover, null]}
            >
              <Switch>
                <Match when={c() !== 0}>
                  <div
                    class="rounded-full w-full h-full"
                    classList={{
                      "bg-black-peg": c() === 1,
                      "bg-white-peg": c() === 2,
                      "shadow-lg shadow-white": i === props.lastMove,
                    }}
                  />
                </Match>
                <Match when={hover() === i}>
                  <div
                    class="rounded-full w-full h-full opacity-50"
                    classList={{
                      "bg-black-peg": props.turn === 1,
                      "bg-white-peg": props.turn === 2,
                    }}
                    style={{
                      animation: "peg-anim 1s ease-in-out infinite",
                    }}
                  />
                </Match>
              </Switch>
            </div>
          )}
        </Index>
      </div>
    </div>
  )
}

export default Board;