## Strcuture

- Layout always owns map to prevent flickering on page switch
- Children passed into layout go directly into the Map
- Each page gets its own component
- Map needs to stay generalized in the layout, children get if via useMap

```
Layout {
  Grid {
    left: Statistics {
      Vertical grid {
        Box num jobs
        Box gpu hours
        etc
      }
    }
    right: Map {
      InterfaceLayerThing {
        Marker
        Marker
        Marker
      }
    }
  }
}
```

## Behavior

Initial state: 
- 2 panels, stats on the left, map on the right
- Map contains a bunch of markers showing projects that have some icon
- Each marker on the map has a click effect that makes it "active"
- Panel has a vertical list of all of the projects
- Each project listing can also be clicked to make it "active"

On click:
- Map centers on the active marker
- All the other markers hide themselves
- Stats panel switches to showing the stats of that project
- "back" button appears in the top left of the stats pannel to un select the active project

Data fetching:
- 