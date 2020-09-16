/**

Copyright 2019 Forestry.io Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

import React from 'react'
import styled from 'styled-components'

interface BreadcrumbProps {
  directory?: string
  setDirectory: (directory: string) => void
}

export function Breadcrumb({ directory, setDirectory }: BreadcrumbProps) {
  return (
    <BreadcrumbWrapper>
      {/**TODO: find a better label for 'Root'
       * Maybe it should be the directory name if its set
       *  Insert / with ::after?
       */}
      <button onClick={() => setDirectory('')}>Root</button>

      <span>/</span>
      {directory &&
        directory.split('/').map((part, index, parts) => (
          <>
            <button
              onClick={() => {
                setDirectory(parts.slice(0, index + 1).join('/'))
              }}
            >
              {part}
            </button>
            <span>/</span>
          </>
        ))}
    </BreadcrumbWrapper>
  )
}

const BreadcrumbWrapper = styled.div`
  width: 100%;
  display: flex;
  padding-bottom: var(--tina-padding-small);
  color: var(--tina-color-grey-4);
  font-size: var(--tina-font-size-2);

  > *:not(:first-child) {
    padding-left: 8px;
  }
`
