import { HTMLContainer, Rectangle2d, ShapeUtil, T } from "tldraw";
import { ChartComponent } from "../components/chart/ChartComponent";

export class ChartShapeUtil extends ShapeUtil {
  static type = "chart";

  static props = {
    type: T.string,
    data: T.arrayOf(
      T.object({
        label: T.string,
        value: T.number,
      })
    ),
    title: T.string,
    w: T.number,
    h: T.number,
  };

  getDefaultProps() {
    return {
      type: "bar",
      data: [
        { label: "A", value: 10 },
        { label: "B", value: 20 },
        { label: "C", value: 15 },
      ],
      title: "Sample Chart",
      w: 400,
      h: 300,
    };
  }

  canResize() {
    return true;
  }

  onResize(shape, info) {
    return {
      props: {
        w: Math.max(200, info.scaleX * shape.props.w),
        h: Math.max(150, info.scaleY * shape.props.h),
      },
    };
  }

  getGeometry(shape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
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
        <ChartComponent
          type={shape.props.type}
          data={shape.props.data}
          title={shape.props.title}
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
