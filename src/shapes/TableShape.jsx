import { HTMLContainer, Rectangle2d, ShapeUtil, T } from "tldraw";
import { TableComponent } from "../components/table/TableComponent";

export class TableShapeUtil extends ShapeUtil {
  static type = "table";

  static props = {
    rows: T.number,
    columns: T.number,
    w: T.number,
    h: T.number,
  };

  getDefaultProps() {
    return {
      rows: 3,
      columns: 3,
      w: 450,
      h: 150,
    };
  }

  canEdit() {
    return true;
  }

  canResize() {
    return true;
  }

  isAspectRatioLocked() {
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
        <TableComponent
          rows={shape.props.rows}
          columns={shape.props.columns}
          width={shape.props.w}
          height={shape.props.h}
        />
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
