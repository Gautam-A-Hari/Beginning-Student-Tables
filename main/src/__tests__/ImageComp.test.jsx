import { ImageComp } from '../components/Table/ImageComp';
import renderer from 'react-test-renderer';

/**
 * Snapshot test for image comp rendering
 */
it("renders correctly", () => {
    const imageComp = renderer.create(
        <ImageComp image={ {r: 150, mode: "solid", color: {'r':250, 'g':250, 'b':250, 'a':0}, type: "circle"} } key={1} />
    );
    let tree = imageComp.toJSON();
    expect(tree).toMatchSnapshot();

});