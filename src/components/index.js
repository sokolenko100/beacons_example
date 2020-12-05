/*
 *export components
 */
const components = {
    get MoveView() {

        return require('./Animated/MoveView').default;

    },
    get Auth() {

        return require('./Auth/index');

    },
    get ActivityCard() {

        return require('./Card/ActivityCard').default;

    },
    get ActivityCrewCard() {

        return require('./Card/ActivityCrewCard').default;

    },
    get ActivityListItem() {

        return require('./Card/ActivityListItem').default;

    },
    get ActivitySingleCheckCard() {

        return require('./Card/ActivitySingleCheckCard').default;

    },
    get CrewsCard() {

        return require('./Card/CrewsCard').default;

    },
    get JobListItem() {

        return require('./Card/JobListItem').default;

    },
    get Circle() {

        return require('./Circle/Circle').default;

    },
    get Confirm() {

        return require('./EnrollViews/Confirm').default;

    },
    get IdentifyView() {

        return require('./EnrollViews/IdentifyView').default;

    },
    get SwipeFinger() {

        return require('./EnrollViews/SwipeFinger').default;

    },
    get ErrorBoundaryWithoutDisplay() {

        return require('./ErrorBoundaries/ErrorBoundaryWithoutDisplay').default;

    },
    get IncFlatList() {

        return require('./FlatList/IncFlatList').default;

    },
    get Float() {

        return require('./Float/BottomRight').default;

    },
    get NormalFloatInput() {

        return require('./Input/NormalFloatInput').default;

    },
    get MdNormalLoading() {

        return require('./Loading/MdNormalLoading').default;

    },
    get NoData() {

        return require('./NoData/NoData').default;

    },
    get Timer() {

        return require('./Timer/NormalTimer').default;

    },
    get Touch() {

        return require('./Touch/normalTouch').default;

    },
    get HVCenterView() {

        return require('./SpecView/HVCenterView').default;

    },
    get AsIcon() {

        return require('./Icon/Icon').default;

    },
};
module.exports = components;
