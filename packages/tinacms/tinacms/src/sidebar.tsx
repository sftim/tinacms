import * as React from 'react'
import { useCMS, useSubscribable } from '@tinacms/react-tinacms'
import { useState } from 'react'
import { StyledFrame } from './styled-frame'
import styled, { css, ThemeProvider } from 'styled-components'
import { FormsView, SaveButton, CancelButton } from './components/FormView'
import { ScreenPlugin } from '@tinacms/core'
import { Modal, ModalHeader, ModalBody } from './modalProvider'
import { ModalPopup } from './modalPopup'
import { ModalFullscreen } from './modalFullscreen'
import { TextField } from '@tinacms/fields'
import { Close, Hamburger, LeftArrow, Edit } from '@tinacms/icons'
import {
  Theme,
  RootElement,
  HEADER_HEIGHT,
  FOOTER_HEIGHT,
  SIDEBAR_WIDTH,
  TOGGLE_WIDTH,
} from './Globals'
import { Button } from './components/Button'
import { useSidebar } from './sidebarProvider'

export const Sidebar = ({ open = true }: { open?: boolean }) => {
  const cms = useCMS()
  useSubscribable(cms.screens)
  const [menuIsVisible, setMenuVisibility] = useState(false)
  const [ActiveView, setActiveView] = useState<ScreenPlugin | null>(null)

  return (
    <SidebarContainer open={open}>
      <StyledFrame
        id="sidebar-frame"
        frameStyles={{
          position: 'absolute',
          left: '0',
          top: '0',
          width: 'calc(0.5rem + ' + SIDEBAR_WIDTH + ')',
          height: '100%',
          margin: '0',
          padding: '0',
          border: '0',
          pointerEvents: open ? 'all' : 'none',
        }}
      >
        <SidebarWrapper open={open}>
          <RootElement />
          <SidebarHeader>
            <ActionsToggle
              onClick={() => setMenuVisibility(!menuIsVisible)}
              open={menuIsVisible}
            >
              {menuIsVisible ? <Close /> : <Hamburger />}
            </ActionsToggle>
          </SidebarHeader>
          <FormsView />

          <MenuPanel visible={menuIsVisible}>
            <MenuWrapper>
              {cms.plugins.all('content-button').map(plugin => (
                <CreateContentButton plugin={plugin} />
              ))}
              <MenuList>
                {cms.screens.all().map(view => (
                  <MenuLink
                    value={view.name}
                    onClick={() => {
                      setActiveView(view)
                      setMenuVisibility(false)
                    }}
                  >
                    <Close /> {view.name}
                  </MenuLink>
                ))}
              </MenuList>
            </MenuWrapper>
          </MenuPanel>
          {ActiveView && (
            <Modal>
              <ModalFullscreen>
                <button onClick={() => setActiveView(null)}>Close Modal</button>
                <ActiveView.Component />
              </ModalFullscreen>
            </Modal>
          )}
        </SidebarWrapper>
      </StyledFrame>
      <SidebarToggle open={open} />
    </SidebarContainer>
  )
}

const CreateContentButton = ({ plugin }: any) => {
  let cms = useCMS()
  let [postName, setPostName] = React.useState('')
  let [open, setOpen] = React.useState(false)
  return (
    <div>
      <CreateButton onClick={() => setOpen(p => !p)}>
        {plugin.name}
      </CreateButton>
      {open && (
        <Modal>
          <ModalPopup>
            <ModalHeader>{plugin.name}</ModalHeader>
            <ModalBody>
              <TextField
                onChange={e => setPostName(e.target.value)}
                value={postName}
              />
            </ModalBody>
            <ModalActions>
              <SaveButton
                onClick={() => {
                  plugin.onSubmit(postName, cms)
                  setOpen(false)
                }}
              >
                Create
              </SaveButton>
              <CancelButton onClick={() => setOpen(p => !p)}>
                Cancel
              </CancelButton>
            </ModalActions>
          </ModalPopup>
        </Modal>
      )}
    </div>
  )
}

const SidebarToggle = ({ open = true }: { open?: boolean }) => {
  let sidebar = useSidebar()

  return (
    <StyledFrame
      id="sidebar-frame"
      frameStyles={{
        position: 'absolute',
        right: '0',
        bottom: '1.5rem',
        width: '3.5rem',
        height: '4rem',
        margin: '0',
        padding: '0',
        border: '0',
        overflow: 'hidden',
        pointerEvents: 'all',
      }}
    >
      <>
        <RootElement />
        <SidebarToggleButton onClick={() => sidebar.setIsOpen(!sidebar.isOpen)}>
          {open ? <LeftArrow /> : <Edit />}
        </SidebarToggleButton>
      </>
    </StyledFrame>
  )
}

const MenuList = styled.div`
  margin: 2rem -${p => p.theme.padding}rem 2rem -${p => p.theme.padding}rem;
  display: block;
`

const MenuLink = styled.div<{ value: string }>`
  color: #f2f2f2;
  font-size: 1.125rem;
  font-weight: 500;
  padding: ${p => p.theme.padding}rem ${p => p.theme.padding}rem
    ${p => p.theme.padding}rem 4rem;
  position: relative;
  cursor: pointer;
  transition: all ${p => p.theme.timing.short} ease-out;
  overflow: hidden;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #3e3e3e;
    z-index: -1;
    transition: transform ${p => p.theme.timing.short} ease-out,
      opacity ${p => p.theme.timing.short} ${p => p.theme.timing.short} ease-out;
    transform: translate3d(0, 100%, 0);
    opacity: 0;
  }
  &:hover {
    color: ${p => p.theme.color.primary};
    &:after {
      transform: translate3d(0, 0, 0);
      transition: transform ${p => p.theme.timing.short} ease-out, opacity 0ms;
      opacity: 1;
    }
    svg {
      fill: ${p => p.theme.color.primary};
    }
    & ~ * {
      &:after {
        transform: translate3d(0, -100%, 0);
      }
    }
  }
  svg {
    position: absolute;
    left: ${p => p.theme.padding}rem;
    top: 50%;
    transform: translate3d(0, -50%, 0);
    width: 1.75rem;
    height: auto;
    fill: #bdbdbd;
    transition: all ${p => p.theme.timing.short} ease-out;
  }
`

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1050;
  width: 100%;
  height: ${HEADER_HEIGHT}rem;
  flex: 0 0 ${HEADER_HEIGHT}rem;
  padding: 0 ${p => p.theme.padding}rem;
  border-bottom: 1px solid rgba(51, 51, 51, 0.09);
`

const ActionsToggle = styled.button<{ open: boolean }>`
  padding: 0 ${p => p.theme.padding}rem;
  margin-left: -${p => p.theme.padding}rem;
  background: transparent;
  outline: none;
  border: 0;
  text-align: left;
  width: 3rem;
  height: ${HEADER_HEIGHT}rem;
  transition: all 75ms ease-out;
  fill: ${p => (p.open ? '#F2F2F2' : '#828282')};
  &:hover {
    opacity: 0.6;
    cursor: pointer;
  }
`

const MenuWrapper = styled.div`
  position: absolute;
  left: 0;
  top: ${HEADER_HEIGHT}rem;
  height: calc(100vh - (${HEADER_HEIGHT}rem));
  width: 100%;
  overflow: hidden;
  padding: ${p => p.theme.padding}rem;
  ul,
  li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
`

const MenuPanel = styled.div<{ visible: boolean }>`
  background: #333333;
  z-index: 1000;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${SIDEBAR_WIDTH};
  transform: translate3d(${p => (p.visible ? '0' : '-100%')}, 0, 0);
  overflow: hidden;
  padding: ${p => p.theme.padding}rem;
  transition: all 150ms ease-out;
  ul,
  li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
`

const CreateButton = styled(Button)`
  width: 100%;
`

const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
  border-radius: 0 0 ${p => p.theme.radius.big} ${p => p.theme.radius.big};
  overflow: hidden;
  ${Button} {
    border-radius: 0;
    flex: 1 0 auto;
  }
`

const SidebarToggleButton = styled.button`
  position: fixed;
  top: 0.5rem;
  left: 0;
  box-shadow: 0px 2px 3px rgba(48, 48, 48, 0.15);
  border-radius: 0 0.5rem 0.5rem 0;
  width: 3rem;
  height: 3rem;
  border: 0;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  fill: white;
  text-align: center;
  background-color: #0084ff;
  background-repeat: no-repeat;
  background-position: center;
  transition: background 0.35s ease;
  cursor: pointer;
  &:hover {
    background-color: #4ea9ff;
  }
  &:active {
    background-color: #0073df;
  }
`

const SidebarWrapper = styled.div<{ open: boolean }>`
  margin: 0;
  padding: 0;
  border: 0;
  z-index: 1;
  background-color: white;
  position: absolute;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  width: ${SIDEBAR_WIDTH};
  height: 100%;
  left: 0;
  top: 0;

  &:before,
  &:after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  &:before {
    /* Animate box-shadow with opacity for better performance */
    box-shadow: ${p => p.theme.shadow.big};
    transition: all ${p => (p.open ? 150 : 200)}ms ease-out;
    opacity: ${p => (p.open ? 1 : 0)};
  }
  &:after {
    /* Overlay outer border */
    border-right: 1px solid rgba(51, 51, 51, 0.09);
  }
`

const SidebarContainer = styled.div<{ open: boolean }>`
  position: fixed;
  display: block;
  background: transparent;
  height: 100%;
  width: calc(${SIDEBAR_WIDTH} + ${TOGGLE_WIDTH});
  margin: 0;
  padding: 0;
  border: 0;
  z-index: 2147000000;
  transition: all ${p => (p.open ? 150 : 200)}ms ease-out;
  transform: translate3d(${p => (p.open ? '0' : '-' + SIDEBAR_WIDTH)}, 0, 0);
  pointer-events: none;
`
