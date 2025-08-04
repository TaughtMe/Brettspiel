import { generateBoardData } from '../state/boardGenerator';
import { TOTAL_RING_FIELDS, PLAYER_COLORS } from '../state/constants';
import { Field } from './Field';
import { useGameStore } from '../state/gameStore';
import { Piece } from './Piece';
import type { Field as FieldType, Piece as PieceType } from '../types';

const { ringFields, startFields, homeFields } = generateBoardData();
const allFields = [...ringFields, ...startFields, ...homeFields];

export function Board() {
  const viewBoxSize = 1000;
  const center = viewBoxSize / 2;
  const ringRadius = viewBoxSize * 0.47;
  const fieldSpacing = 55;
  const homeStartOffset = 70;

  const pieces = useGameStore((state) => state.pieces);
  const selectedPieceId = useGameStore((state) => state.selectedPieceId);
  const setSelectedPiece = useGameStore((state) => state.setSelectedPiece);
  const moveSelectedPieceTo = useGameStore((state) => state.moveSelectedPieceTo);

  const selectedPiece = pieces.find(p => p.id === selectedPieceId);

  const handlePieceClick = (clickedPiece: PieceType) => {
    // Fall 1: Es ist bereits eine Figur ausgewählt.
    if (selectedPiece) {
      // Wenn die bereits ausgewählte Figur erneut geklickt wird -> Auswahl aufheben.
      if (selectedPiece.id === clickedPiece.id) {
        setSelectedPiece(null);
      } else {
        // Wenn eine ANDERE Figur geklickt wird -> interpretiere dies als "Zug"-Befehl.
        // Unser gameStore kümmert sich um die Logik (Schlagen, etc.).
        moveSelectedPieceTo(clickedPiece.position);
      }
    } else {
      // Fall 2: Es ist noch keine Figur ausgewählt -> Klick bedeutet "Auswählen".
      setSelectedPiece(clickedPiece.id);
    }
  };  
  
  const getCoordsForPosition = (piece: PieceType): { cx: number; cy: number } | null => {
    let field: FieldType | undefined;
    
    // Fallback: Wenn eine Position keinem Spieler zugeordnet ist (z.B. Startpositionen im state),
    // wird die Farbe der Figur selbst als Referenz verwendet.
    const playerForPosition = piece.position.player || piece.color;

    if (piece.position.type === 'ring') {
      field = allFields.find(f => f.type === 'ring' && f.index === piece.position.index);
    } else {
      field = allFields.find(f => f.type === piece.position.type && f.player === playerForPosition && f.index === piece.position.index);
    }
    
    if (!field) return null;

    switch (field.type) {
      case 'ring': {
        const angle = (field.index / TOTAL_RING_FIELDS) * 2 * Math.PI - Math.PI / 2;
        return { cx: center + ringRadius * Math.cos(angle), cy: center + ringRadius * Math.sin(angle) };
      }
      case 'start': {
        const playerIndex = PLAYER_COLORS.indexOf(field.player!);
        const baseCoords = [ { x: 47, y: 47 }, { x: 897, y: 47 }, { x: 897, y: 897 }, { x: 47, y: 897 }, ];
        const offsetX = (field.index % 2) * fieldSpacing;
        const offsetY = Math.floor(field.index / 2) * fieldSpacing;
        return { cx: baseCoords[playerIndex].x + offsetX, cy: baseCoords[playerIndex].y + offsetY };
      }
      case 'home': {
        const playerIndex = PLAYER_COLORS.indexOf(field.player!);
        let cx = 0, cy = 0;
        switch (playerIndex) {
          case 0: cx = center; cy = center - ringRadius + homeStartOffset + (field.index * fieldSpacing); break;
          case 1: cx = center + ringRadius - homeStartOffset - (field.index * fieldSpacing); cy = center; break;
          case 2: cx = center; cy = center + ringRadius - homeStartOffset - (field.index * fieldSpacing); break;
          case 3: cx = center - ringRadius + homeStartOffset + (field.index * fieldSpacing); cy = center; break;
        }
        return { cx, cy };
      }
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <g id="player-zones">
          {PLAYER_COLORS.map((color, index) => {
            const zoneSize = fieldSpacing * 2 + 30;
            const zoneCoords = [{ x: 5, y: 5 },{ x: 855, y: 5 },{ x: 855, y: 855 },{ x: 5, y: 855 }];
            const { x, y } = zoneCoords[index];
            return <rect key={`zone-${color}`} x={x} y={y} width={zoneSize} height={zoneSize} fill={color} fillOpacity="0.25" rx="20" />;
          })}
        </g>
        <g id="ring-fields">
    {ringFields.map((field, index) => {
        const coords = getCoordsForPosition({ position: field } as any);
        return coords && (
        <Field
            key={field.id}
            cx={coords.cx}
            cy={coords.cy}
            onClick={selectedPiece ? () => moveSelectedPieceTo({ type: field.type, index: field.index }) : undefined}
            showMarkerDot={index % 2 === 0}
        />
        );
    })}
    </g>
        <g id="start-fields">
          {startFields.map((field) => {
            const coords = getCoordsForPosition({ position: { ...field, player: field.player } } as any);
            const isMoveAllowed = selectedPiece && selectedPiece.color === field.player;
            return coords && <Field key={field.id} cx={coords.cx} cy={coords.cy} color={field.player} onClick={isMoveAllowed ? () => moveSelectedPieceTo({ type: field.type, index: field.index, player: field.player }) : undefined} />;
          })}
        </g>
        <g id="home-fields">
          {homeFields.map((field) => {
            const coords = getCoordsForPosition({ position: { ...field, player: field.player } } as any);
            const isMoveAllowed = selectedPiece && selectedPiece.color === field.player;
            return coords && <Field key={field.id} cx={coords.cx} cy={coords.cy} color={field.player} onClick={isMoveAllowed ? () => moveSelectedPieceTo({ type: field.type, index: field.index, player: field.player }) : undefined} />;
          })}
        </g>
        <g id="pieces">
          {pieces.map((piece) => {
            const coords = getCoordsForPosition(piece);
            if (!coords) return null;
            return <Piece key={piece.id} id={piece.id} onClick={() => handlePieceClick(piece)} color={piece.color} cx={coords.cx} cy={coords.cy} />;
          })}
        </g>
      </svg>
    </div>
  );
}