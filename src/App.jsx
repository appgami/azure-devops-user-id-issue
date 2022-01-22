import React, { useEffect, useState } from 'react';
import * as SDK from 'azure-devops-extension-sdk';
import { getService } from 'azure-devops-extension-sdk';
import { IdentityServiceIds } from 'azure-devops-extension-api/Identities';
import { decode } from 'jsonwebtoken';

const App = () => {
  const [myId, setMyId] = useState();
  const [identityServiceUserId, setIdentityServiceUserId] = useState();
  const [tokenNameId, setTokenNameId] = useState();
  const [allIDsEqual, setAllIDsEqual] = useState();

  useEffect(() => {
    (async () => {
      SDK.init({ loaded: false });
      await SDK.ready();
      SDK.notifyLoadSucceeded();

      // My current user ID
      const myself = await SDK.getUser();
      setMyId(myself.id);

      // Searching user from identity service
      const identityService = await getService(
        IdentityServiceIds.IdentityService
      );
      const identities = await identityService.searchIdentitiesAsync(
        myself.id,
        ['user'],
        undefined,
        'uid'
      );
      const myIdentity = identities.length && identities[0];
      setIdentityServiceUserId(myIdentity.localId);

      // Decoding token
      const token = await SDK.getAppToken();
      const { nameid } = decode(token);
      setTokenNameId(nameid);

      setAllIDsEqual(
        myId === identityServiceUserId && identityServiceUserId === tokenNameId
      );
    })();
  });

  return (
    <>
      {!tokenNameId && <span>Loading...</span>}
      {tokenNameId && (
        <>
          <div>Current user ID coming from SDK.getUser() = {myId}</div>
          <div>
            User ID coming from the identity service API ={' '}
            {identityServiceUserId}
          </div>
          <div>
            Property nameid from decoded token coming from SDK.getAppToken() ={' '}
            {tokenNameId}
          </div>
          <div>Are they all the same? {allIDsEqual ? 'yes' : 'no'}</div>
          <p style={{ maxWidth: '800px' }}>
            <b>Notes:</b> <br />
            {allIDsEqual
              ? `Frequently, user IDs are not the same when comparing the results coming from different APIs used here and the app token. However, sometimes, these IDs do match and the reason why this behaviour is random is unkown. ` +
                `If trying accessing a different Azure DevOps instance with this same user, the user ID might be different or not.`
              : 'Note that the IDs returned by the APIs are different in comparison to the ID in the app token for the same user. This is a problem when it comes to using the appToken for user validation in Azure DevOps extensions.'}
          </p>
        </>
      )}
    </>
  );
};

export default App;
