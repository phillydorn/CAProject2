import fetch from '../../utils/api';

export const RERANKED = Symbol('RERANKED');


const reranked = ({customSchoolsList}) => {
  return {
    type: RERANKED,
    customSchoolsList,
  };
};


export function rerank ({currentRank, newRank, customSchoolsList, teamId, schoolId}) {

  return (dispatch, getState) => {
    const newOrder = customSchoolsList.map((school, index)=>{
      if (newRank < currentRank) {

        if (index < newRank || index > currentRank-1) {
          return school;
        } else if (index === newRank) {
          return customSchoolsList[currentRank-1];
        } else {
          return customSchoolsList[index-1];
        }
      } else {
        if (index < currentRank-1 || index >= newRank) {
          return school;
        } else if (index === newRank-1) {
          return customSchoolsList[currentRank-1];
        } else {
          return customSchoolsList[index+1];
        }
      }
    });
    dispatch(reranked({customSchoolsList: newOrder}));
    return fetch(getState().log)(`/api/teams/${teamId}`, {
      method: 'PUT',
      body: JSON.stringify({
        schoolId,
        currentRank,
        newRank,
      })
    })
    .then((response)=> {
      console.log('response', response)
      // MainActions.populate(teamId, null, 'custom');
    })
    // dispatch(reranked({customSchoolsList: newOrder}));
  }
}

