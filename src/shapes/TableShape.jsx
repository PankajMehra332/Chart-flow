import { HTMLContainer, Rectangle2d, ShapeUtil, T } from "tldraw";
import { TableComponent } from "../components/table/TableComponent";

export class TableShapeUtil extends ShapeUtil {
  static type = "table";

  static props = {
    rows: T.number,
    columns: T.number,
    w: T.number,
    h: T.number,
    cellData: T.dict(T.string, T.string),
  };

  getDefaultProps() {
    const defaultRows = 3;
    const defaultCols = 3;
    const defaultCellData = {};
    for (let r = 0; r < defaultRows; r++) {
      for (let c = 0; c < defaultCols; c++) {
        defaultCellData[`${r}-${c}`] = "";
      }
    }
    return {
      rows: defaultRows,
      columns: defaultCols,
      w: 450,
      h: 150,
      cellData: defaultCellData,
    };
  }

  canResize() {
    return true;
  }

  isAspectRatioLocked() {
    return false;
  }

  canEdit() {
    return false;
  }

  getGeometry(shape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  onResize(shape, info) {
    return {
      props: {
        w: Math.max(100, info.scaleX * shape.props.w),
        h: Math.max(60, info.scaleY * shape.props.h),
      },
    };
  }

  component(shape) {
    return (
      <HTMLContainer
        style={{
          width: shape.props.w,
          height: shape.props.h,
          pointerEvents: "all",
        }}
      >
        <TableComponent shape={shape} />
      </HTMLContainer>
    );
  }

  indicator(shape) {
    return (
      <rect
        width={shape.props.w}
        height={shape.props.h}
        fill="transparent"
        stroke="var(--color-selected)"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
    );
  }
}
