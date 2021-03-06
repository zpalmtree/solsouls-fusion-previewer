import React from 'react';
import {
    Tabs,
    Tab,
    AppBar,
    ThemeProvider,
    createTheme,
    Typography,
    ImageList,
    ImageListItem,
    makeStyles,
    Link,
} from '@material-ui/core';
import { deepPurple, deepOrange } from '@material-ui/core/colors';

import { SoulPicker } from './SoulPicker';
import { Soul } from './Soul';
import { fuseSouls } from './Fusion';
import { SoulCanvas } from './SoulCanvas';
import { FusionResult } from './Types';

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

const theme = createTheme({
    palette: {
        primary: deepPurple,
        secondary: deepOrange,
    },
});

const useStyles = makeStyles({
    imageContainer: {
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    imageItem: {
        width: '256px!important',
        margin: '1px',
    }
});

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
}

function SoulGenerator() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <div
                style={{
                    marginTop: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <SoulPicker
                    id={'1'}
                    includeRandomButton={true}
                    includeConfigurationOptions={true}
                />
            </div>
            <div style={{
                marginTop: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Typography>
                    Tip: Create your soul with no background, to make a great profile picture for your social media.
                </Typography>
                <Typography>
                    Note that some souls you can create in this generator are not real valid souls. For example, star glasses appear to not exist in the wild with hair.
                </Typography>
            </div>
        </div>
    );
}

function FusionPreview() {
    const classes = useStyles();

    const [leftSoul, setLeftSoul] = React.useState<Soul>();
    const [rightSoul, setRightSoul] = React.useState<Soul>();
    const [fusedSouls, setFusedSouls] = React.useState<FusionResult[]>([]);
    const [probabilitySum, setProbabilitySum] = React.useState<number>(0);
    const [selectedImages, setSelectedImages] = React.useState<number[]>([]);

    React.useEffect(() => {
        setSelectedImages([]);
        setProbabilitySum(0);
        setFusedSouls(fuseSouls(leftSoul, rightSoul));
    }, [
        leftSoul,
        rightSoul,
    ]);

    React.useEffect(() => {
        let probability = 0;

        for (const selected of selectedImages) {
            probability += fusedSouls[selected].probability;
        }

        setProbabilitySum(probability);
    }, [
        selectedImages,
        fusedSouls,
    ]);

    function handleSelected(
        canvasIndex: number,
        probability: number) {

        setSelectedImages((images) => {
            const newImages = [...images];

            const index = newImages.indexOf(canvasIndex);

            /* If the canvas doesn't exist in the current selected images map,
             * then we are toggling it on. */
            const selected = index === -1;

            if (selected) {
                newImages.push(canvasIndex);
            } else {
                newImages.splice(index, 1);
            }

            return newImages;
        });
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <div
                style={{
                    marginTop: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                }}
            >
                <SoulPicker
                    id={'1'}
                    configRightStyles={{ marginRight: '0px' }}
                    includeRandomButton={true}
                    includeConfigurationOptions={true}
                    onSoulChange={setLeftSoul}
                />
                <SoulPicker
                    id={'2'}
                    configLeftStyles={{ marginLeft: '0px' }}
                    includeRandomButton={true}
                    includeConfigurationOptions={true}
                    onSoulChange={setRightSoul}
                />
            </div>
            <Typography>
                Combined probability of selected items: {`${(Math.abs(probabilitySum * 100)).toFixed(4)}%`}
            </Typography>
            <div style={{
                marginTop: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <ImageList
                    rowHeight={256}
                    cols={6}
                    gap={0}
                    classes={{
                        root: classes.imageContainer,
                    }}
                >
                    {fusedSouls.map((fusion, idx) => (
                        <ImageListItem
                            key={`fuse-canvas-${idx}`}
                            classes={{root: classes.imageItem}}
                        >
                            <SoulCanvas
                                soul={fusion.soul}
                                probability={fusion.probability}
                                index={idx}
                                id={`fuse-canvas-${idx}`}
                                selected={selectedImages.includes(idx)}
                                onSelectedChange={handleSelected}
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </div>
        </div>
    );
}

function AboutInfo() {
    return (
        <div style={{
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Typography>
                This application is not made by the SolSouls developers. All image assets belong to the SolSouls developers.
            </Typography>
            <Typography>
                My intepretation of the fusion mechanics and resulting probabilities is taken from
                <Link href={'https://medium.com/@solanasolsouls/introducing-soulfusion-20762394e5ed'}>
                    {` here `}
                </Link>
            </Typography>
            <Typography>
                and possibly may be incorrect. Always verify before purchasing or fusing.
            </Typography>
            <Typography style={{
                marginTop: '20px',
            }}>
                You can find the source code for this site 
                <Link href={'https://github.com/zpalmtree/solsouls-fusion-previewer'}>
                    {` here.`}
                </Link>
            </Typography>
            <Typography style={{
                marginTop: '20px',
            }}>
                I'm not affiliated with the team or paid for my work, just another souls fan.
            </Typography>
            <Typography>
                If you want to say thanks, consider
                <Link href={'https://www.buymeacoffee.com/zpalmtree'}>
                    {` buying me a coffee `}
                </Link>
                or sending me some SOL.
            </Typography>
            <Typography>
                ALd4UHgcX9sXJzFiodRihi6W6AoYNs3vHxRSZzjWafgH
            </Typography>
        </div>
    );
}

function App() {
    const [tab, setTab] = React.useState(0);
        function handleTabChange(event: React.ChangeEvent<{}>, newValue: number) {
        setTab(newValue);
    }

    return (
        <>
            <ThemeProvider theme={theme}>
                <AppBar position="static">
                    <Tabs
                        value={tab}
                        onChange={handleTabChange}
                        centered
                    > 
                        <Tab label="Soul Fusion Preview"/>
                        <Tab label="Soul Creator/Generator"/>
                        <Tab label="About"/>
                    </Tabs>
                </AppBar>
                <TabPanel value={tab} index={0}>
                    <FusionPreview/>
                </TabPanel>
                <TabPanel value={tab} index={1}>
                    <SoulGenerator/>
                </TabPanel>
                <TabPanel value={tab} index={2}>
                    <AboutInfo/>
                </TabPanel>
            </ThemeProvider>
        </>
    );
}

export default App;
