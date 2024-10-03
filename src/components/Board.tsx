import range from "lodash.range";
import { Component, createMemo, createSignal, For, Index, Show } from "solid-js";
import { Transition } from "solid-transition-group";
import { Outcome } from "../model";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type BoardComponent = Component<{
  board: number[],
  width: number,
  height: number,
  lastMove: number | null,
  scores: number[] | null,
  turn: number,
  canPlay: boolean,
  outcome: Outcome,
  threats: number[],
  play: (i: number) => void,
}>

const Board: BoardComponent = props => {
  const [hover, setHover] = createSignal<number | null>(null);

  const dimensions = createMemo(() => {
    const x = 0.06 * (140 + 50 * (props.width - 1));
    const y = 0.06 * (140 + 50 * (props.height - 1));
    const m = Math.max(x, y);
    return m > 50 ? [x * 42 / m, y * 42 / m] : [x, y];
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
      class="bg-wood border-4 border-black rounded-3xl relative z-20"
      style={{
        width: `${dimensions()[0]}rem`,
        height: `${dimensions()[1]}rem`,
      }}
    >
      <svg viewBox={`-70 -70 ${140 + 50 * (props.width - 1)} ${140 + 50 * (props.height - 1)}`} class="select-none">
        <defs>
          <radialGradient id="black-gradient" cx="30%" cy="25%" r="100%" fx="30%" fy="25%">
            <stop offset="0%" style="stop-color:rgb(109, 109, 109);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgb(4, 4, 4);stop-opacity:1" />
          </radialGradient>
          <radialGradient id="white-gradient" cx="30%" cy="25%" r="100%" fx="30%" fy="25%">
            <stop offset="0%" style="stop-color:rgb(238, 238, 238);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgb(187, 187, 187);stop-opacity:1" />
          </radialGradient>
        </defs>
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
        <Index each={props.board}>
          {(c, i) => (
            <g transform={`translate(${50 * (i % props.width)} ${50 * (i / props.width | 0)})`}>
              <rect
                x="-25"
                y="-25"
                width="50"
                height="50"
                class="transition-opacity duration-1000"
                style={{ opacity: c() > 0 || !props.scores ? 0 : 0.5 }}
                fill={!props.scores ? "transparent" : `rgb(255,${256 * (1 - props.scores[i])},0)`}
                onClick={[props.play, i]}
                onPointerEnter={[setHover, i]}
                onPointerLeave={[setHover, null]}
              />
              <Transition
                onExit={(el, done) => {
                  const a = el.animate([
                    { opacity: 1, transform: "translateY(0)" },
                    { opacity: 0, transform: "translateY(-50px)" }], {
                    duration: 600
                  });
                  a.finished.then(done);
                }}
              >
                {c() !== 0 &&
                  <circle
                    cx="0"
                    cy="0"
                    r="20"
                    fill={c() === 1 ? "url(#black-gradient)" : "url(#white-gradient)"}
                  />
                }
              </Transition>
            </g>
          )}
        </Index>
        <Show when={props.canPlay && hover() !== null && props.board[hover()!] === 0}>
          <circle
            cx={50 * (hover()! % props.width)}
            cy={50 * (hover()! / props.width | 0)}
            r="20"
            fill={props.turn === 1 ? "url(#black-gradient)" : "url(#white-gradient)"}
            opacity="0.7"
            class="pointer-events-none animate-peg"
          />
        </Show>
        <Show when={!props.outcome && props.canPlay}>
          <For each={props.threats}>
            {threat =>
              <circle
                cx={50 * (threat % props.width)}
                cy={50 * (threat / props.width | 0)}
                r="20"
                fill="red"
                filter="drop-shadow(0px 0px 5px red)"
                class="pointer-events-none animate-threat"
              />
            }
          </For>
        </Show>
        {props.lastMove !== null &&
          <circle
            cx={50 * (props.lastMove % props.width)}
            cy={50 * (props.lastMove / props.width | 0)}
            r="10"
            stroke={props.turn === 1 ? "black" : "white"}
            stroke-width="3"
            fill="transparent"
            class="pointer-events-none"
          />
        }
        {props.outcome && props.outcome.color !== 0 &&
          <line
            x1={50 * (props.outcome.alignment[0] % props.width)}
            x2={50 * (props.outcome.alignment[1] % props.width)}
            y1={50 * (props.outcome.alignment[0] / props.width | 0)}
            y2={50 * (props.outcome.alignment[1] / props.width | 0)}
            stroke="red"
            stroke-width="8"
            stroke-linecap="round"
            class="pointer-events-none"
          />
        }
      </svg>
    </div>
  )
}

export default Board;