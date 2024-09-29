import range from "lodash.range";
import { Component, createMemo, createSignal, For, Index, Show } from "solid-js";
import { Transition } from "solid-transition-group";
import { Winner } from "../model";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type BoardComponent = Component<{
  board: number[],
  width: number,
  height: number,
  lastMove: number | null,
  scores: number[] | null,
  turn: number,
  canPlay: boolean,
  winner: Winner,
  threats: number[],
  play: (i: number) => void,
}>

const Board: BoardComponent = props => {
  const [hover, setHover] = createSignal<number | null>(null);

  const dimensions = createMemo(() => {
    const x = 0.05 * (140 + 50 * (props.width - 1));
    const y = 0.05 * (140 + 50 * (props.height - 1));
    const m = Math.max(x, y);
    return m > 42 ? [x * 42 / m, y * 42 / m] : [x, y];
  });

  const points = () => {
    const mx = props.width / 2 | 0;
    const my = props.height / 2 | 0;
    const qx = mx / 2 | 0;
    const qy = my / 2 | 0;
    return [[mx, my], [mx - qx, my - qy], [mx + qx, my - qy], [mx - qx, my + qy], [mx + qx, my + qy]];
  }

  return (
    <div
      class="bg-seamless border-4 border-black rounded-3xl relative"
      style={{
        width: `${dimensions()[0]}rem`,
        height: `${dimensions()[1]}rem`,
      }}
    >
      <svg viewBox={`-70 -70 ${140 + 50 * (props.width - 1)} ${140 + 50 * (props.height - 1)}`} class="select-none">
        <For each={range(0, props.height)}>
          {i =>
            <>
              <line
                x1="0"
                x2={50 * (props.width - 1)}
                y1={50 * i}
                y2={50 * i}
                stroke="black"
                stroke-width="1"
              />
              <text
                x="-50"
                y={50 * i}
                class="boardtext"
              >
                {props.height - i}
              </text>
              <text
                x={50 * (props.width - 1) + 50}
                y={50 * i}
                class="boardtext"
              >
                {props.height - i}
              </text>
            </>
          }
        </For>
        <For each={range(0, props.width)}>
          {i =>
            <>
              <line
                y1="0"
                y2={50 * (props.height - 1)}
                x1={50 * i}
                x2={50 * i}
                stroke="black"
                stroke-width="1"
              />
              <text
                y="-50"
                x={50 * i}
                class="boardtext"
              >
                {alphabet[i]}
              </text>
              <text
                y={50 * (props.height - 1) + 50}
                x={50 * i}
                class="boardtext"
              >
                {alphabet[i]}
              </text>
            </>
          }
        </For>
        <For each={points()}>
          {([x, y]) => (
            <circle cx={50 * x} cy={50 * y} r="5" fill="black" />
          )}
        </For>
        <foreignObject x="-25" y="-25" width={props.width * 50} height={props.height * 50}>
          <div class="relative w-full h-full">
            <Index each={props.board}>
              {(c, i) => (
                <div
                  class="absolute flex justify-center items-center"
                  style={{
                    left: `${50 * (i % props.width)}px`,
                    top: `${50 * (i / props.width | 0)}px`,
                    width: "50px",
                    height: "50px",
                  }}
                  onClick={[props.play, i]}
                  onPointerEnter={[setHover, i]}
                  onPointerLeave={[setHover, null]}
                >
                  <div
                    class="absolute w-full h-full transition-opacity duration-1000"
                    style={{
                      opacity: c() > 0 || !props.scores ? 0 : 0.5,
                      "background-color": !props.scores ? "transparent" : `rgb(255,${256 * props.scores[i]},0)`,
                    }}
                  />
                  <Transition
                    onExit={(el, done) => {
                      const a = el.animate([
                        { opacity: 1, transform: "translateY(0)" },
                        { opacity: 0, transform: "translateY(-4rem)" }], {
                        duration: 600
                      });
                      a.finished.then(done);
                    }}
                  >
                    {c() !== 0 &&
                      <div
                        class="rounded-full w-4/5 h-4/5"
                        classList={{
                          "bg-black-peg": c() === 1,
                          "bg-white-peg": c() === 2,
                          "shadow-lg shadow-white": i === props.lastMove,
                        }}
                      />
                    }
                  </Transition>
                  <Show when={props.threats.includes(i)}>
                    <div
                      class="absolute rounded-full w-4/5 h-4/5 bg-red-500 bg-opacity-70 shadow-threat"
                      //style={{ animation: "blink-anim 1s ease-in-out infinite" }}
                    />
                  </Show>
                  <Show when={props.canPlay && c() === 0 && hover() === i}>
                    <div
                      class="rounded-full w-4/5 h-4/5 opacity-50"
                      classList={{
                        "bg-black-peg": props.turn === 1,
                        "bg-white-peg": props.turn === 2,
                      }}
                      style={{ animation: "peg-anim 1s ease-in-out infinite" }}
                    />
                  </Show>
                </div>
              )}
            </Index>
          </div>
        </foreignObject>
        {props.winner &&
          <line
            x1={50 * (props.winner.alignment[0] % props.width)}
            x2={50 * (props.winner.alignment[1] % props.width)}
            y1={50 * (props.winner.alignment[0] / props.width | 0)}
            y2={50 * (props.winner.alignment[1] / props.width | 0)}
            stroke="red"
            stroke-width="8"
            stroke-linecap="round"
          />
        }
      </svg>
    </div>
  )
}

export default Board;