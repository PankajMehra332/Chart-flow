import { HTMLContainer, Rectangle2d, ShapeUtil, T, resizeBox } from "tldraw";
import "tldraw/tldraw.css";
import { TableComponent } from "../components/table/TableComponent";

export class TableShapeUtil extends ShapeUtil {
  static type = "table";
  static props = {
    rows: T.number,
    columns: T.number,
    cellWidth: T.number,
    cellHeight: T.number,
  };

  getDefaultProps() {
    return { rows: 3, columns: 3, cellWidth: 150, cellHeight: 50 };
  }

  canEdit() {
    return false;
  }
  canResize() {
    return true;
  }
  isAspectRatioLocked() {
    return false;
  }

  getGeometry(shape) {
    return new Rectangle2d({
      width: shape.props.columns * shape.props.cellWidth,
      height: shape.props.rows * shape.props.cellHeight,
      isFilled: true,
    });
  }

  onResize(shape, info) {
    const resized = resizeBox(shape, info);
    return {
      ...shape,
      props: {
        ...shape.props,
        cellWidth: resized.props.width / shape.props.columns,
        cellHeight: resized.props.height / shape.props.rows,
      },
    };
  }

  component(shape) {
    return (
      <HTMLContainer
        style={{ backgroundColor: "#fff", border: "1px solid #ccc", pointerEvents: "all" }}
      >
        <TableComponent
          rows={shape.props.rows}
          columns={shape.props.columns}
          x={shape.x}
          y={shape.y}
          cellWidth={shape.props.cellWidth}
          cellHeight={shape.props.cellHeight}
        />
      </HTMLContainer>
    );
  }

  indicator(shape) {
    return (
      <rect
        width={shape.props.columns * shape.props.cellWidth}
        height={shape.props.rows * shape.props.cellHeight}
      />
    );
  }
}
