      const {
        Button,
        colors,
        createMuiTheme,
        CssBaseline,
        Dialog,
        DialogActions,
        DialogContent,
        DialogContentText,
        DialogTitle,
        Icon,
        MuiThemeProvider,
        Typography,
        withStyles,
        ExpansionPanel,
        ExpansionPanelSummary,
        ExpansionPanelDetails,
        Paper,
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableFooter,
        TablePagination,
        TableRow,
        Tab,
        Tabs,
        Drawer,
        AppBar,
        List,
        ListItem,
        ListItemText,
        Divider,
        Toolbar,
        GridList,
        GridListTile,
        SwipeableDrawer
      } = window['material-ui'];


      const drawerWidth = 240;

      const styles = theme => ({
        root: {
          zIndex: 1,
          overflow: "hidden",
          position: "relative",
        },
        button: {
          margin: theme.spacing.unit,
        },
        appBar: {
          zIndex: theme.zIndex.drawer + 1,
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: drawerWidth
        },
        drawerPaper: {
          position: 'relative',
          width: drawerWidth,
        },
        code: {
          margin: "50px",
          height: "400px",
          fontFamily: "Roboto, sans-serif",
          fontSize: "16px",
        },
        content: {
          flexGrow: 1,
          backgroundColor: theme.palette.background.default,
          padding: theme.spacing.unit * 3,
          minWidth: 0, // So the Typography noWrap works
        },
        toolbar: theme.mixins.toolbar,
        heading: {
          fontSize: theme.typography.pxToRem(15),
          flexBasis: "10%",
          flexShrink: 0,
        },
        secondaryHeading: {
          fontSize: theme.typography.pxToRem(15),
          color: theme.palette.text.secondary,
        },
        row: {
          "[selected]": {
            backgroundColor: theme.palette.background.default,
          },
          cursor: "pointer"
        }
      });

      @withStyles(styles)
      class Dataset extends React.Component {

        constructor() {
          super();
          this.state = {"summary": false, "code": false};
        }

        toggleDrawer(side, open) {
          // console.log("toggling");
          this.setState({
            [side]: open,
          });
        }

        render() {
          const {classes} = this.props;
          const dataset = this.props.dataset;
          dataset.classes = dataset.classes || [];

          return (
            <div className={classes.root}>
              <main className={classes.content}>
                <center>
                  <Button variant="outlined" color="primary" className={classes.button}>Images</Button>
                  <Button variant="outlined" className={classes.button} 
                    onClick={this.toggleDrawer.bind(this, "summary", true)}>
                    Details
                  </Button>
                  <Button variant="outlined" className={classes.button}
                    onClick={this.toggleDrawer.bind(this, "code", true)}>
                    Code
                  </Button>
                  <Button variant="outlined" className={classes.button} disabled>
                    Download
                  </Button>
                </center>

                <SwipeableDrawer 
                  anchor="top"
                  open={this.state.summary}
                  onClose={this.toggleDrawer.bind(this, "summary", false)}
                  onOpen={this.toggleDrawer.bind(this, "summary", true)}
                  >
                  <Row name="release number" value={dataset.release} description="hello world" />
                  <Row name="release date" value={dataset.dateReleased} description="hello world" />
                  <Row name="creation date" value={dataset.dateCreated} description="hello world" />
                  <Row name="published date" value={dataset.datePublished} description="hello world" />
                  <Row name="modified date" value={dataset.dateModified} description="hello world" />
                </SwipeableDrawer>

                <SwipeableDrawer 
                  anchor="top"
                  open={this.state.code}
                  onClose={this.toggleDrawer.bind(this, "code", false)}
                  onOpen={this.toggleDrawer.bind(this, "code", true)}
                  >

                  <textarea className={classes.code}>
                    {JSON.stringify(this.props.dataset, undefined, 2)}
                  </textarea>

                </SwipeableDrawer>

                <br />
                <Typography variant="headline" component="h3" className={classes.heading}>{dataset.name}</Typography>
                  
                <br />
                <Typography variant="subheading" className={classes.heading}>{dataset.description}</Typography>

                <br />
                <br />
                <br />

                <Browser dataset={this.props.dataset} />

              </main>
            </div>
          );
        }
      }

      @withStyles(styles)
      class Browser extends React.Component {
        constructor(props) {
          super();
          this.state = {
            selected: 0,
            page: 0
          };

          // alert(props.dataset.classes);
          this.state.classes = (props.dataset.classes || []).map(clazz => {
            if (typeof clazz != "string") {
              return {status: "loaded", value: clazz};
            } else {
              return {status: "loading", value: clazz};
            }
          });

          this.fetch();
        }

        async fetch() {
          let classes = this.state.classes;
          let expand = (image) => typeof image == "string" ? { url: image } : image;
          for (let i = 0; i < classes.length; i++) {
            let clazz = classes[i];
            if (clazz.status == "loaded") {
              // passed by value
              clazz.value.images = clazz.value.images.map(expand);
              continue;
            }
            // console.log(clazz);
            let result = await fetch(clazz.value);
            // console.log(result);
            if (!result.ok) {
              classes[i].status = "failed";
              this.setState({classes: classes});
            } else {
              classes[i].status = "loaded";
              classes[i].value = await result.json();
              this.setState({classes: classes});
            }
          }
        }

        handleChangePage(event, page) {
          const PAGE_SIZE = 5;
          // console.log(page);
          // console.log(page * PAGE_SIZE);
          this.setState({page: page, selected: PAGE_SIZE * page});
        };

        handleClick(e, id) {
          this.setState({selected: id});
        }

        render() {
          const {classes} = this.props;
          const list = this.state.classes;
          let offset = this.state.page;
          const PAGE_SIZE = 5;
          let page = list.slice(offset * PAGE_SIZE, (offset + 1) * PAGE_SIZE);
          let total = list.length / PAGE_SIZE;
          let selected = this.state.selected;

          // console.log(offset);
          // console.log(selected);

          return (
            <div>
                <Paper>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Class</TableCell>
                        <TableCell>Number of images</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                      page.map((clazz, id) => {
                        return (
                          <TableRow 
                             className={classes.row}
                             onClick={event => this.handleClick(event, offset * PAGE_SIZE + id)}
                             selected={(offset * PAGE_SIZE + id) == selected}>
                            <TableCell>{clazz.status == "loaded" ? clazz.value.name : "loading"}</TableCell>
                            <TableCell>{clazz.status == "loaded" ? (clazz.value.images || []).length : "loading"}</TableCell>
                          </TableRow>
                        )
                      })
                      }
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                           colSpan={2}
                           count={total}
                           rowsPerPage={PAGE_SIZE}
                           page={offset}
                           rowsPerPageOptions={PAGE_SIZE}
                           onChangePage={this.handleChangePage.bind(this)}
                           />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </Paper>

                <br /> 
                <Gallery clazz={list[selected]} />
                <br />

            </div>
          );
        }
      }

      @withStyles(styles)
      class Gallery extends React.Component {
        constructor() {
          super();
          this.state = {selected: undefined};
        }
        handleToggle() {
          if (this.state.selected != undefined) {
            this.setState({selected: undefined});
          }
        }
        render() {
          const {classes} = this.props;
          let {value, status} = this.props.clazz;
          if (status != "loaded") {
            return (<div />);
          }
          let clazz = value;
          return (
            <div>
              <Typography className={classes.heading}>{clazz.name}</Typography>
                <br />
                <br />
              <GridList cellHeight={160} className={classes.gridList} cols={3}>
              {
                (clazz.images || []).map((image, index) => {
                  return (
                    <GridListTile key={image.url}>
                      <img style={{cursor: "pointer"}} src={image.url} onClick={() => this.setState({selected: index})}/>
                    </GridListTile>
                  )
                })
                }
              </GridList>

              <Dialog open={this.state.selected != undefined} onClose={this.handleToggle.bind(this)}>
                <DialogTitle>Image</DialogTitle>
                <div onClick={this.handleToggle.bind(this)}>
                  <img src={this.state.selected != undefined && clazz.images[this.state.selected].url} />
                </div>
              </Dialog>
            </div>
          );
        }
      }

      @withStyles(styles)
      class Row extends React.Component {
        render() {
          const {classes} = this.props;
          return (
             <ExpansionPanel>
               <ExpansionPanelSummary>
                 <Typography className={classes.heading}>{this.props.name}</Typography>
                 <Typography className={classes.secondaryHeading}>{this.props.value}</Typography>
               </ExpansionPanelSummary>
               <ExpansionPanelDetails>
                 <Typography>{this.props.description}</Typography>
               </ExpansionPanelDetails>
             </ExpansionPanel>
          );
        }
      }
            
function render(dataset, error, el) {
 // Use the ReactDOM.render to show your component on the browser
 // const root = document.getElementById("root");
 let root = document.createElement("div");
 el.parentNode.insertBefore(root, el);
 ReactDOM.render(<Dataset dataset={dataset} error={error}/>, root);
}

async function load(file) {
 try {
  let result = await fetch(file);
  if (!result.ok) {
   return {error: `Failed to load ${file}. ${result}`};
  }
  
  return {dataset: await result.json()};
 } catch (e) {
  return {error: `Failed to loading ${file}. Check your JS console.`};
 }
}

async function main() {
 let selector = document.querySelector("script[type='application/ld+json']");
 if (!selector) {
  console.log("no JSON-LD file found in this page");
  return;
 }

 let file = selector.src;
 let el = selector;

 let {dataset, error} = await load(file);
 render(dataset, error, el);
}

main();
