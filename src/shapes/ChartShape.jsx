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

  getGeometry(shape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  component(shape) {
    return (
      <HTMLContainer style={{ background: "#fff", border: "1px solid #ccc" }}>
        <ChartComponent
          type={shape.props.type}
          data={shape.props.data}
          title={shape.props.title}
        />
      </HTMLContainer>
    );
  }

  indicator(shape) {
    console.log(shape, "shape");
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
